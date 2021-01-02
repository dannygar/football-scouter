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

        /// <summary>Posts the specified event.</summary>
        /// <param name="score">The score data.</param>
        /// <returns>Task&lt;System.Boolean&gt;.</returns>
        [HttpPost("save")]
        [ValidateModelState]
        [SwaggerOperation("events")]
        [SwaggerResponse(statusCode: 200, type: typeof(bool), description: "true - if the new events were created, otherwise - false")]
        public async Task<bool> PostAsync([FromBody] ScoreModel score)
        {
            const string partitionKey = "/user";

            try
            {
                using (var db = new CosmosUtil<ScoreModel>("scores", partitionKey: partitionKey))
                {
                    score.UpdatedOn = DateTime.UtcNow;

                    //Create or replace the Scores document
                    await db.UpsertItemAsync(score, partitionKey: partitionKey);

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
