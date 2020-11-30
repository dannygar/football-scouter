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
    [Route(HttpRouteConstants.ScoresRoutePrefix)]
    [ApiController]
    public class ScoresController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly AgentProcessor _agentProcessor;

        public ScoresController(
            ILogger<ScoresController> logger,
            AgentProcessor agentProcessor)
        {
            this._logger = logger;
            this._agentProcessor = agentProcessor;
        }

        /// <summary>Posts the specified event.</summary>
        /// <param name="score">The score data.</param>
        /// <returns>Task&lt;System.Boolean&gt;.</returns>
        [HttpPost(HttpRouteConstants.OnAddScoresRequestRoute)]
        [ValidateModelState]
        [SwaggerOperation("scores")]
        [SwaggerResponse(statusCode: 200, type: typeof(bool), description: "true - if the new scores were created, otherwise - false")]
        public async Task<bool> PostAsync([FromBody] Score score)
        {
            try
            {
                using (var db = new CosmosUtil<Score>("scores", partitionKey: "agent/id"))
                {
                    var theScore = await db.GetItemAsync(
                        score.Id.ToString(),
                        score.Agent.Id.ToString());

                    if (theScore == null) // The scores doesn't exist
                    {
                        theScore.CreatedOn = DateTime.UtcNow;

                        // Find if the agent already has been added to the Db, and if not, add him or her to the Db
                        var theAgent = await this._agentProcessor.AddAgentAsync(score.Agent);

                    }
                    else
                    {
                        theScore.UpdatedOn = DateTime.UtcNow;
                    }

                    //Create or replace the Scores document
                    await db.UpsertItemAsync(theScore, partitionKey: "/agent/id");

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
