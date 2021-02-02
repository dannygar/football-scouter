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
    [Route(HttpRouteConstants.GameRoutePrefix)]
    [ApiController]
    public class GamesController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly AgentProcessor _agentProcessor;

        public GamesController(
            ILogger<EventsController> logger,
            AgentProcessor agentProcessor)
        {
            this._logger = logger;
            this._agentProcessor = agentProcessor;
        }

        [HttpGet("")]
        [ValidateModelState]
        [SwaggerOperation("games")]
        [SwaggerResponse(statusCode: 200, type: typeof(IEnumerable<IGame>), description: "The list of IGame objects")]
        public async Task<IEnumerable<IGame>> GetAsync()
        {
            const string partitionKey = "/id";
            try
            {
                using (var db = new CosmosUtil<IGame>("games", partitionKey: partitionKey))
                {
                    // Return all games
                    return await db.GetItemsAsync("SELECT * FROM c");
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
        /// <param name="games">The games collection.</param>
        /// <returns>Task&lt;System.Boolean&gt;.</returns>
        [HttpPost("save")]
        [ValidateModelState]
        [SwaggerOperation("games")]
        [SwaggerResponse(statusCode: 200, type: typeof(bool), description: "true - if the new scores were created, otherwise - false")]
        public async Task<bool> PostAsync([FromBody] IEnumerable<IGame> games)
        {
            const string partitionKey = "/id";
            try
            {
                using (var db = new CosmosUtil<IGame>("games", partitionKey: partitionKey))
                {
                    // Update the create/update date
                    foreach (var game in games)
                    {
                        game.UpdatedOn = DateTime.UtcNow.ToString();
                    }

                    //Create or replace the Games documents
                    var response = await db.UpsertArrayAsync(games.ToList());

                    return response.SuccessfulDocuments == games.Count();
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
