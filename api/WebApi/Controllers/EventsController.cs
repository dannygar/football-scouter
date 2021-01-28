using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ScouterApi.Attributes;
using ScouterApi.Constants;
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
                        $"SELECT * FROM c WHERE c.gameId = '{id}'");
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
        /// <param name="id"></param>
        /// <returns>scoreEvent&lt;EventModel&gt;.</returns>
        [HttpGet("game/stats")]
        [ValidateModelState]
        [SwaggerOperation("events")]
        [SwaggerResponse(statusCode: 200, type: typeof(ScouterApi.Models.EventModel), description: "the Score object containing Events")]
        public async Task<IEnumerable<ScouterApi.Models.ConsensusModel>> GetGameStatsAsync([FromQuery] string id)
        {
            const string partitionKey = "/gameId";

            try
            {
                using (var db = new CosmosUtil<Scouter.Data.EventModelDTO>("events", partitionKey: partitionKey))
                {
                    //Check if the item is already exist, and then replace it
                    var eventData = await db.GetItemsAsync(
                        $"SELECT * FROM c WHERE c.gameId = '{id}'");
                    if (eventData.Count() == 0) return null;

                    var scoreStats = await ScoresProcessor.ProcessScoresAsync(eventData);
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

                using (var db = new CosmosUtil<Scouter.Data.EventModelDTO>("events", partitionKey: partitionKey))
                {
                    //Check if the item is already exist, and then replace it
                    var oldScores = await db.GetItemsAsync(
                        $"SELECT * FROM c WHERE c.gameId = '{scoreEvent.GameId}' and c.account = '{scoreEvent.Account}'");
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

                    return true;
                }
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
