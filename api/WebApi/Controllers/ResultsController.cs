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
    ///[Authorize]
    [Route(HttpRouteConstants.ResultsRoutePrefix)]
    [ApiController]
    public class ResultsController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly AgentProcessor _agentProcessor;
        private readonly IMapper _mapper;

        public ResultsController(
            ILogger<EventsController> logger,
            AgentProcessor agentProcessor,
            IMapper mapper)
        {
            this._logger = logger;
            this._agentProcessor = agentProcessor;
            this._mapper = mapper;
        }

        [HttpGet("")]
        [ValidateModelState]
        [SwaggerOperation("results")]
        [SwaggerResponse(statusCode: 200, type: typeof(GoldCircleModel), description: "The Results for the specific game")]
        public async Task<Dictionary<string, int>> GetGameResultsAsync([FromQuery] string id)
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

                    // Get Hits
                    var hits = ScoresProcessor.ProcessHits(eventData);
                    return hits;
                }
            }
            catch (Exception e)
            {
                LogUtil.LogError(this._logger, e.Message, nameof(this.GetGameResultsAsync));
                Console.WriteLine(e);
                throw;
            }

        }

    }
}
