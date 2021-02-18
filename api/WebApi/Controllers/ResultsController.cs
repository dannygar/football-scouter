using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
    [Authorize]
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
        [SwaggerResponse(statusCode: 200, type: typeof(IEnumerable<ResultsModel>), description: "The Results for the specific game")]
        public async Task<IEnumerable<ResultsModel>> GetGameResultsAsync([FromQuery] string id)
        {
            const string partitionKey = "/gameId";
            try
            {
                using (var db = new CosmosUtil<ResultsModel>("results", partitionKey: partitionKey))
                {
                    //Check if the item is already exist, and then replace it
                    var results = await db.GetItemsAsync(
                        $"SELECT * FROM c WHERE c.gameId = '{id}'");

                    // Return the game results
                    return results.OrderByDescending(r => r.Score);
                }
            }
            catch (Exception e)
            {
                LogUtil.LogError(this._logger, e.Message, nameof(this.GetGameResultsAsync));
                Console.WriteLine(e);
                throw;
            }
        }


        [HttpGet("calculate")]
        [ValidateModelState]
        [SwaggerOperation("results")]
        [SwaggerResponse(statusCode: 200, type: typeof(IEnumerable<ResultsModel>), description: "The Results for the specific game")]
        public async Task<IEnumerable<ResultsModel>> CalculateGameResultsAsync([FromQuery] string id)
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

                    // Return the game results
                    return ScoresProcessor.ProcessResults(eventData);
                }
            }
            catch (Exception e)
            {
                LogUtil.LogError(this._logger, e.Message, nameof(this.CalculateGameResultsAsync));
                Console.WriteLine(e);
                throw;
            }
        }


        [HttpGet("standings")]
        [ValidateModelState]
        [SwaggerOperation("results")]
        [SwaggerResponse(statusCode: 200, type: typeof(IEnumerable<StandingModel>), description: "The Current Standing for the specified number of weeks (games)")]
        public async Task<IEnumerable<StandingModel>> GetStandingTableAsync([FromQuery] int numOfGames)
        {
            const string partitionKey = "/gameId";
            var standings = new List<StandingModel>();
            IEnumerable<IGame> lastGames = null;

            try
            {
                using (var db = new CosmosUtil<IGame>("games", partitionKey: "/id"))
                {
                    // Return all games
                    var allGames = await db.GetItemsAsync("SELECT * FROM c");

                    // Take only the last numOfGames
                    lastGames = (numOfGames > 0) ? allGames.TakeLast(numOfGames) : allGames;
                }

                using (var db = new CosmosUtil<ResultsModel>("results", partitionKey: partitionKey))
                {
                    //Check if the item is already exist, and then replace it
                    var allResults = await db.GetItemsAsync($"SELECT * FROM c");

                    // Obtain the results for only the last # of games
                    List<ResultsModel> lastResults = (from result in allResults
                                                      let gameResult = lastGames.Where(g => g.Id.ToString() == result.GameId).FirstOrDefault()
                                                      where gameResult != null
                                                      select result).ToList();

                    // Generate the current standing based on the last # of game results
                    foreach (var result in lastResults)
                    {
                        var standing = standings.Where(s => s.AgentId == result.AgentId).FirstOrDefault();
                        if (standing != null)
                        {
                            standing.Score += result.Score;
                        }
                        else
                        {
                            standings.Add(new StandingModel
                            {
                                Id = Guid.NewGuid(),
                                UpdatedOn = DateTime.UtcNow.ToString(),
                                AgentId = result.AgentId,
                                DisplayName = result.DisplayName,
                                Score = result.Score
                            });
                        }
                    }

                    return standings.OrderByDescending(s => s.Score);
                }
            }
            catch (Exception e)
            {
                LogUtil.LogError(this._logger, e.Message, nameof(this.GetStandingTableAsync));
                Console.WriteLine(e);
                throw;
            }
        }


    }
}
