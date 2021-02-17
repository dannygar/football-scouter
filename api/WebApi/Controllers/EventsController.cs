using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Scouter.Common.Models;
using ScouterApi.Attributes;
using ScouterApi.Constants;
using ScouterApi.Models;
using ScouterApi.Processors;
using ScouterApi.Utils;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScouterApi.Controllers
{
    /// <summary>
    /// Scouter Controller
    /// </summary>
    ///[Authorize]
    [Route(HttpRouteConstants.EventsRoutePrefix)]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly AgentProcessor _agentProcessor;
        private readonly IMapper _mapper;

        public EventsController(
            ILogger<EventsController> logger,
            AgentProcessor agentProcessor,
            IMapper mapper)
        {
            this._logger = logger;
            this._agentProcessor = agentProcessor;
            this._mapper = mapper;
        }

        /// <summary>Gets the game's events.</summary>
        /// <param name="id"></param>
        /// <returns>scoreEvent&lt;EventModel&gt;.</returns>
        [HttpGet("game/events")]
        [ValidateModelState]
        [SwaggerOperation("events")]
        [SwaggerResponse(statusCode: 200, type: typeof(ScouterApi.Models.EventModel), description: "the Score object containing Events")]
        public async Task<IEnumerable<ScouterApi.Models.EventModel>> GetGameEventsAsync([FromQuery] string id)
        {
            const string partitionKey = "/gameId";

            try
            {
                using (var db = new CosmosUtil<Scouter.Data.EventModelDTO>("events", partitionKey: partitionKey))
                {
                    //Check if the item is already exist, and then replace it
                    var eventData = await db.GetItemsAsync(
                        $"SELECT * FROM c WHERE c.gameId = '{id}' and c.isMaster = false");
                    var gameEvents = _mapper.Map<Scouter.Data.EventModelDTO[], IEnumerable<ScouterApi.Models.EventModel>>(eventData.ToArray());
                    return gameEvents;
                }
            }
            catch (Exception e)
            {
                LogUtil.LogError(this._logger, e.Message, nameof(this.GetGameStatsAsync));
                Console.WriteLine(e);
                throw;
            }
        }

        /// <summary>Gets the game's stats.</summary>
        /// <param name="gameId"></param>
        /// <param name="agentKeys"></param>
        /// <returns>scoreEvent&lt;ConsensusModel&gt;.</returns>
        [HttpPost("game/stats")]
        [ValidateModelState]
        [SwaggerOperation("events")]
        [SwaggerResponse(statusCode: 200, type: typeof(IEnumerable<ScouterApi.Models.ConsensusModel>), description: "the Score object containing Events")]
        public async Task<IEnumerable<ScouterApi.Models.ConsensusModel>> GetGameStatsAsync([FromBody] GoldCircleModel goldCircle)
        {
            if (!goldCircle.AgentIds.Any()) return null;

            const string partitionKey = "/gameId";

            try
            {
                using (var db = new CosmosUtil<Scouter.Data.EventModelDTO>("events", partitionKey: partitionKey))
                {
                    //Check if the item is already exist, and then replace it
                    var eventData = await db.GetItemsAsync(
                        $"SELECT * FROM c WHERE c.gameId = '{goldCircle.GameId}'");
                    if (eventData.Count() == 0) return null;

                    // Filter event data to include only the keys from the selected agents
                    var filteredData = (from key in goldCircle.AgentIds
                                        let data = eventData.Where(d => d.Account == key).FirstOrDefault()
                                        where data != null
                                        select data).ToList();
                    var scoreStats = ScoresProcessor.ProcessScores(filteredData);
                    return scoreStats;
                }
            }
            catch (Exception e)
            {
                LogUtil.LogError(this._logger, e.Message, nameof(this.GetGameStatsAsync));
                Console.WriteLine(e);
                throw;
            }
        }


        /// <summary>Gets the user's Scores for the specific game.</summary>
        /// <param name="id"></param>
        /// <param name="account"></param>
        /// <returns>scoreEvent&lt;EventModel&gt;.</returns>
        [HttpGet("game/account")]
        [ValidateModelState]
        [SwaggerOperation("events")]
        [SwaggerResponse(statusCode: 200, type: typeof(ScouterApi.Models.EventModel), description: "the Score object containing Events")]
        public async Task<ScouterApi.Models.EventModel> GetEventsByAccountAsync([FromQuery] string id, [FromQuery] string account)
        {
            const string partitionKey = "/gameId";

            try
            {
                using (var db = new CosmosUtil<Scouter.Data.EventModelDTO>("events", partitionKey: partitionKey))
                {
                    //Check if the item is already exist, and then replace it
                    var events = await db.GetItemsAsync(
                        $"SELECT * FROM c WHERE c.gameId = '{id}' and c.account = '{account}'");
                    if (events.Count() > 0)
                    {
                        var data = events.Last<Scouter.Data.EventModelDTO>();
                        var apiScores = _mapper.Map<ScouterApi.Models.EventModel>(data);
                        return apiScores;
                    }
                    return null;
                }
            }
            catch (Exception e)
            {
                LogUtil.LogError(this._logger, e.Message, nameof(this.GetEventsByAccountAsync));
                Console.WriteLine(e);
                throw;
            }
        }


        /// <summary>Posts the specified event.</summary>
        /// <param name="scoreEvent">The scoreEvent data.</param>
        /// <returns>Task&lt;System.Boolean&gt;.</returns>
        [HttpPost("save")]
        [ValidateModelState]
        [SwaggerOperation("events")]
        [SwaggerResponse(statusCode: 200, type: typeof(bool), description: "true - if the new events were created, otherwise - false")]
        public async Task<bool> PostAsync([FromBody] ScouterApi.Models.EventModel scoreEvent)
        {
            const string partitionKey = "/gameId";

            // Update the new events's date
            scoreEvent.UpdatedOn = DateTime.UtcNow.ToString();

            try
            {
                // Map API data object to Data
                var scoreDTO = _mapper.Map<Scouter.Data.EventModelDTO>(scoreEvent);

                IEnumerable<Scouter.Data.EventModelDTO> gameScores = null;

                using (var db = new CosmosUtil<Scouter.Data.EventModelDTO>("events", partitionKey: partitionKey))
                {
                    // Get all game scores
                    gameScores = await db.GetItemsAsync(
                        $"SELECT * FROM c WHERE c.gameId = '{scoreEvent.GameId}'");

                    //Check if the item is already exist, and then replace it
                    var oldScores = gameScores.Where(s => s.Account == scoreEvent.Account).ToList();
                    //var oldScores = await db.GetItemsAsync(
                    //    $"SELECT * FROM c WHERE c.gameId = '{scoreEvent.GameId}' and c.account = '{scoreEvent.Account}'");
                    if (oldScores.Count() > 0)
                    {
                        // delete any old items except the last one
                        for (var i = 0; i < oldScores.Count() - 1; i++)
                        {
                            await db.DeleteItemAsync(oldScores.ToArray()[i].Id.ToString(), oldScores.ToArray()[i].GameId.ToString());
                        }

                        //Update precision for the event's time
                        foreach (var item in scoreEvent.Events)
                        {
                            item.EventTime = Decimal.Round(item.EventTime, 2);
                        }

                        //Replace the Scores document
                        await db.ReplaceItemAsync(scoreDTO, oldScores.Last().Id.ToString(), partitionKey: scoreEvent.GameId.ToString());
                    }
                    else
                    {
                        // Create a new one
                        await db.AddItemAsync(scoreDTO, partitionKey: scoreEvent.GameId.ToString());
                    }
                }

                if (scoreDTO.IsMaster)
                {
                    // Calculate the game results and save it in the Database
                    var gameResults = ScoresProcessor.ProcessResults(gameScores).ToList();
                    if (gameResults == null) return false;

                    // Save to the database
                    using (var db = new CosmosUtil<ResultsModel>("results", partitionKey: partitionKey))
                    {
                        // Get all game scores
                        var results = await db.GetItemsAsync(
                            $"SELECT * FROM c WHERE c.gameId = '{scoreEvent.GameId}'");

                        if (results.Count() > 0)
                        {

                            // Replace any old items with the new ones
                            foreach (var item in results)
                            {
                                //Delete old document
                                await db.DeleteItemAsync(item.Id.ToString(), partitionKey: scoreEvent.GameId.ToString());
                            }
                        }

                        // Create or update the results
                        await db.UpsertArrayAsync(gameResults, partitionKey: scoreEvent.GameId.ToString());

                    }
                }

                return true;
            }
            catch (Exception e)
            {
                LogUtil.LogError(this._logger, e.Message, nameof(this.PostAsync));
                Console.WriteLine(e);
                throw;
            }
        }
    }
}
