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
    ///[Authorize]
    [Route(HttpRouteConstants.EventsRoutePrefix)]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly AgentProcessor _agentProcessor;

        public EventsController(
            ILogger<EventsController> logger,
            AgentProcessor agentProcessor)
        {
            this._logger = logger;
            this._agentProcessor = agentProcessor;
        }


        /// <summary>Gets the user's Scores for the specific game.</summary>
        /// <param name="id"></param>
        /// <param name="account"></param>
        /// <returns>score&lt;ScoreModel&gt;.</returns>
        [HttpGet()]
        [ValidateModelState]
        [SwaggerOperation("events")]
        [SwaggerResponse(statusCode: 200, type: typeof(ScoreModel), description: "the Score object containing Events")]
        public async Task<ScoreModel> GetAsync([FromQuery] string id, [FromQuery] string account)
        {
            const string partitionKey = "/gameId";

            try
            {
                using (var db = new CosmosUtil<ScoreModel>("scores", partitionKey: partitionKey))
                {
                    //Check if the item is already exist, and then replace it
                    var scores = await db.GetItemsAsync(
                        $"SELECT * FROM c WHERE c.gameId = '{id}' and c.account = '{account}'");
                    return scores.Count() > 0 ? scores.Last<ScoreModel>() : null;
                }
            }
            catch (Exception e)
            {
                LogUtil.LogError(this._logger, e.Message, nameof(this.GetAsync));
                Console.WriteLine(e);
                throw;
            }
        }


        /// <summary>Posts the specified event.</summary>
        /// <param name="score">The score data.</param>
        /// <returns>Task&lt;System.Boolean&gt;.</returns>
        [HttpPost("save")]
        [ValidateModelState]
        [SwaggerOperation("events")]
        [SwaggerResponse(statusCode: 200, type: typeof(bool), description: "true - if the new events were created, otherwise - false")]
        public async Task<bool> PostAsync([FromBody] ScoreModel score)
        {
            const string partitionKey = "/gameId";

            // Update the new scores's date
            score.UpdatedOn = DateTime.UtcNow.ToString();

            try
            {
                using (var db = new CosmosUtil<ScoreModel>("scores", partitionKey: partitionKey))
                {
                    //Check if the item is already exist, and then replace it
                    var oldScores = await db.GetItemsAsync(
                        $"SELECT * FROM c WHERE c.gameId = '{score.GameId}' and c.account = '{score.Account}'");
                    if (oldScores.Count() > 0)
                    {
                        // delete any old items except the last one
                        for (var i = 0; i < oldScores.Count() - 1; i++)
                        {
                            await db.DeleteItemAsync(oldScores.ToArray()[i].Id.ToString(), oldScores.ToArray()[i].GameId.ToString());
                        }

                        //Update precision for the event's time
                        foreach (var item in score.Events)
                        {
                            item.EventTime = Decimal.Round(item.EventTime, 2);
                        }

                        //Replace the Scores document
                        await db.ReplaceItemAsync(score, oldScores.Last().Id.ToString(), partitionKey: score.GameId.ToString());
                    }
                    else
                    {
                        // Create a new one
                        await db.AddItemAsync(score, partitionKey: score.GameId.ToString());
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
