using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
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
    [Authorize]
    [Route(HttpRouteConstants.StatsRoutePrefix)]
    [ApiController]
    public class StatsController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly AgentProcessor _agentProcessor;
        private readonly IMapper _mapper;

        public StatsController(
            ILogger<EventsController> logger,
            AgentProcessor agentProcessor,
            IMapper mapper)
        {
            this._logger = logger;
            this._agentProcessor = agentProcessor;
            this._mapper = mapper;
        }

        [HttpGet("goldcircle")]
        [ValidateModelState]
        [SwaggerOperation("stats")]
        [SwaggerResponse(statusCode: 200, type: typeof(GoldCircleModel), description: "The Gold Circle for the specific game")]
        public async Task<GoldCircleModel> GetGoldenCircleAsync([FromQuery] string id)
        {
            const string partitionKey = "/gameId";
            try
            {
                using (var db = new CosmosUtil<GoldCircleModel>("GoldCircle", partitionKey: partitionKey))
                {
                    // Return the Gold Circle for the specific game
                    var goldCircle = await db.GetItemsAsync($"SELECT * FROM c WHERE c.gameId = '{id}'");

                    return goldCircle.FirstOrDefault();
                }
            }
            catch (Exception e)
            {
                LogUtil.LogError(this._logger, e.Message, nameof(this.GetGoldenCircleAsync));
                Console.WriteLine(e);
                throw;
            }
        }


        /// <summary>Saves the Golden Circle.</summary>
        /// <param name="goldCircle">The Gold Circle collection.</param>
        /// <returns>Task&lt;System.Boolean&gt;.</returns>
        [HttpPost("goldcircle/save")]
        [ValidateModelState]
        [SwaggerOperation("stats")]
        [SwaggerResponse(statusCode: 200, type: typeof(bool), description: "true - if the new scores were created, otherwise - false")]
        public async Task<bool> SaveGoldCirclePostAsync([FromBody] GoldCircleModel goldCircle)
        {
            const string partitionKey = "/gameId";
            try
            {
                using (var db = new CosmosUtil<GoldCircleModel>("GoldCircle", partitionKey: partitionKey))
                {
                    // Update the new events's date
                    goldCircle.UpdatedOn = DateTime.UtcNow.ToString();

                    //Check if the item is already exist, and then replace it
                    var oldGoldenCircle = await db.GetItemsAsync(
                        $"SELECT * FROM c WHERE c.gameId = '{goldCircle.GameId}'");
                    if (oldGoldenCircle.Count() > 0)
                    {
                        // delete any old items except the last one
                        for (var i = 0; i < oldGoldenCircle.Count() - 1; i++)
                        {
                            await db.DeleteItemAsync(oldGoldenCircle.ToArray()[i].Id.ToString(), oldGoldenCircle.ToArray()[i].GameId.ToString());
                        }

                        //Replace the Gold Circle document
                        await db.ReplaceItemAsync(goldCircle, oldGoldenCircle.Last().Id.ToString(), partitionKey: goldCircle.GameId.ToString());
                    }
                    else
                    {
                        // Create a new one
                        await db.AddItemAsync(goldCircle, partitionKey: goldCircle.GameId.ToString());
                    }
                    return true;
                }
            }
            catch (Exception e)
            {
                LogUtil.LogError(this._logger, e.Message, nameof(this.SaveGoldCirclePostAsync));
                Console.WriteLine(e);
                throw;
            }
        }

        /// <summary>Saves the Consensus Result.</summary>
        /// <param name="goldCircle">The Gold Circle collection.</param>
        /// <returns>Task&lt;System.Boolean&gt;.</returns>
        [HttpPost("consensus/save")]
        [ValidateModelState]
        [SwaggerOperation("stats")]
        [SwaggerResponse(statusCode: 200, type: typeof(bool), description: "true - if the new scores were created, otherwise - false")]
        public async Task<bool> SaveConsensusPostAsync(ScouterApi.Models.EventModel scoreEvent)
        {
            const string partitionKey = "/gameId";

            // Update the new events's date
            scoreEvent.UpdatedOn = DateTime.UtcNow.ToString();

            try
            {
                // Map API data object to Data
                var scoreDTO = _mapper.Map<Scouter.Data.EventModelDTO>(scoreEvent);

                using (var db = new CosmosUtil<Scouter.Data.EventModelDTO>("consensus", partitionKey: partitionKey))
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
                LogUtil.LogError(this._logger, e.Message, nameof(this.SaveConsensusPostAsync));
                Console.WriteLine(e);
                throw;
            }
        }
    }
}
