// ***********************************************************************
// <copyright file="HttpRouteConstants.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.TXT file in the project root for full license information.
// </copyright>
// <summary>HTTP route constants for routing requests to CallController methods.</summary>
// ***********************************************************************-

namespace ScouterApi.Constants
{
    /// <summary>
    /// HTTP route constants for routing requests to CallController methods.
    /// </summary>
    public static class HttpRouteConstants
    {
        /// <summary>
        /// Route prefix for all incoming requests.
        /// </summary>
        public const string EventsRoutePrefix = "api/events";

        /// <summary>
        /// Route agent
        /// </summary>
        public const string AgentRoutePrefix = "api/agent";

        /// <summary>
        /// Route agent
        /// </summary>
        public const string GameRoutePrefix = "api/games";

    }
}
