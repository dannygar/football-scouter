using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Scouter.Common;
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
    [Route(HttpRouteConstants.MastersRoutePrefix)]
    [ApiController]
    public class MastersController : ControllerBase
    {
        private readonly ILogger _logger;

        public MastersController(
            ILogger<EventsController> logger)
        {
            this._logger = logger;
        }

        /// <summary>
        /// IsMasterAsync
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("")]
        [ValidateModelState]
        [SwaggerOperation("masters")]
        [SwaggerResponse(statusCode: 200, type: typeof(bool), description: "Returns true if the user is in the list of Masters")]
        public async Task<bool> IsMasterAsync([FromQuery] string id)
        {
            const string partitionKey = "/id";
            try
            {
                using (var db = new CosmosUtil<BaseModel>("masters", partitionKey: partitionKey))
                {
                    //Return TRUE if at least one record exists for the given Id
                    var masterRecord = await db.GetItemsAsync(
                        $"SELECT * FROM c WHERE c.id = '{id}'");
                    return masterRecord != null && masterRecord.Count() > 0;
                }
            }
            catch (Exception e)
            {
                LogUtil.LogError(this._logger, e.Message, nameof(this.IsMasterAsync));
                Console.WriteLine(e);
                throw;
            }

        }

    }
}
