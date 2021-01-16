// <copyright file="LogUtil.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.TXT file in the project root for full license information.
// </copyright>

namespace ScouterApi.Utils
{
    using System;
    using Microsoft.Extensions.Logging;

    /// <summary>
    /// Log class to publish logs/traces into application Insights.
    /// </summary>
    public static class LogUtil
    {
        /// <summary>
        /// Method to handle error messages.
        /// </summary>
        /// <param name="logger">logger.</param>
        /// <param name="messages">message.</param>
        /// <param name="module">module.</param>
        public static void LogError(ILogger logger, string messages, string module)
        {
            ArgumentValidation(logger, messages, module);

            // All the following logs will be picked up by Application Insights.
            // and all of them will have ("Module") in Properties.
            using (logger.BeginScope("found Error message for {module}", module))
            {
                logger.LogError(DateTime.Now.ToShortDateString() + ":" + module + ":" + "Error" + ":" + messages);
            }
        }

        /// <summary>
        /// Method to handle warning messages.
        /// </summary>
        /// <param name="logger">logger.</param>
        /// <param name="messages">message.</param>
        /// <param name="module">module.</param>
        public static void LogWarning(ILogger logger, string messages, string module)
        {
            ArgumentValidation(logger, messages, module);

            // All the following logs will be picked up by Application Insights.
            // and all of them will have ("Module") in Properties.
            using (logger.BeginScope("found Warning message for {module}", module))
            {
                // this.logger.LogWarning("An example of a Warning trace..");
                logger.LogWarning(DateTime.Now.ToShortDateString() + ":" + module + ":" + "warning" + ":" + messages);
            }
        }

        /// <summary>
        /// Method to handle information messages.
        /// </summary>
        /// <param name="logger">logger.</param>
        /// <param name="messages">message.</param>
        /// <param name="module">module.</param>
        public static void LogInformation(ILogger logger, string messages, string module)
        {
            ArgumentValidation(logger, messages, module);

            // All the following logs will be picked up by Application Insights.
            // and all of them will have ("Module") in Properties.
            using (logger.BeginScope("found Information message for {module}", module))
            {
                logger.LogInformation(DateTime.Now.ToShortDateString() + ":" + module + ":" + "Information" + ":" + messages);
            }
        }

        /// <summary>
        /// Method to handle critical messages.
        /// </summary>
        /// <param name="logger">logger.</param>
        /// <param name="messages">message.</param>
        /// <param name="module">module.</param>
        public static void LogCritical(ILogger logger, string messages, string module)
        {
            ArgumentValidation(logger, messages, module);

            // All the following logs will be picked up by Application Insights.
            // and all of them will have ("Module") in Properties.
            using (logger.BeginScope("found critical message for {module}", module))
            {
                logger.LogCritical(DateTime.Now.ToShortDateString() + ":" + module + ":" + "critical" + ":" + messages);
            }
        }

        /// <summary>
        /// Method to validate arguments for nullvalue.
        /// </summary>
        /// <param name="logger">logger.</param>
        /// <param name="messages">message.</param>
        /// <param name="module">module.</param>
        private static void ArgumentValidation(ILogger logger, string messages, string module)
        {
            _ = logger ?? throw new ArgumentNullException(nameof(logger));
            _ = messages ?? throw new ArgumentNullException(nameof(messages));
            _ = module ?? throw new ArgumentNullException(nameof(module));
        }
    }
}
