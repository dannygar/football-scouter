using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ScouterApi.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScouterApi.Controllers
{
    [Authorize]
    [Route(HttpRouteConstants.ScouterRoutePrefix)]
    [ApiController]
    public class ScouterController : ControllerBase
    {
    }
}
