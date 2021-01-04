// <copyright file="HomeController.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.TXT file in the project root for full license information.
// </copyright>

namespace ScouterApi.Controllers.Controllers
{
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;

    /// <summary>
    /// Controller for home/default views
    /// </summary>
    public class HomeController : Controller
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="HomeController"/> class.
        /// </summary>
        public HomeController()
        {
        }

        /// <summary>
        /// The default index view for the Home controller
        /// </summary>
        /// <returns>the view to render</returns>
        public IActionResult Index()
        {
            return BadRequest();
        }

        /// <summary>
        /// Get the default content of home page.
        /// </summary>
        /// <returns>Default content.</returns>
        [HttpGet("/")]
        public string Get()
        {
            return "Welcome to Football Scouter!";
        }
    }
}