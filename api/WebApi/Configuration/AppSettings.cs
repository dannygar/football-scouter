// ***********************************************************************
// Assembly         : ScouterApi
// Author           : dannygar
// Created          : 09-01-2020
//
// Last Modified By : dannygar
// Last Modified On : 09-01-2020
// ***********************************************************************
// <copyright file="AppSettings.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.TXT file in the project root for full license information.
// </copyright>
// <summary></summary>
// ***********************************************************************

namespace ScouterApi.Configuration
{
    using System;
    using Microsoft.Extensions.Configuration;

    /// <summary>
    /// Class AppSettings.
    /// </summary>
    public class AppSettings
    {
        /// <summary>
        /// Gets or sets the logging.
        /// </summary>
        /// <value>The logging.</value>
        public LoggingSettings Logging { get; set; } = new LoggingSettings();

        /// <summary>
        /// Gets or sets the application insights.
        /// </summary>
        /// <value>The application insights.</value>
        public ApplicationInsightsSettings ApplicationInsights { get; set; } = new ApplicationInsightsSettings();

        /// <summary>
        /// Gets or sets the cosmos database.
        /// </summary>
        /// <value>The cosmos database.</value>
        public CosmosDbSettings CosmosDb { get; set; } = new CosmosDbSettings();

        /// <summary>
        /// Gets or sets the Azure AD app details.
        /// </summary>
        /// <value>The Azure AD settings for the application.</value>
        public AzureADSettings AzureAD { get; set; } = new AzureADSettings();

        // Static load helper methods. These could also be moved to a factory class.

        /// <summary>
        /// Gets the configuration.
        /// </summary>
        /// <param name="dir">The dir.</param>
        /// <returns>IConfigurationRoot.</returns>
        public static IConfigurationRoot GetConfiguration(string dir)
        {
            return GetConfiguration(dir, null);
        }

        /// <summary>
        /// Gets the configuration.
        /// </summary>
        /// <param name="dir">The dir.</param>
        /// <param name="environmentName">Name of the environment.</param>
        /// <returns>IConfigurationRoot.</returns>
        public static IConfigurationRoot GetConfiguration(string dir, string environmentName)
        {
            if (string.IsNullOrEmpty(environmentName))
            {
                environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            }

            var builder = new ConfigurationBuilder()
                .SetBasePath(dir)
                .AddJsonFile("appsettings.json", true, true)
                .AddJsonFile($"appsettings.{environmentName}.json", true)
                .AddEnvironmentVariables();

            return builder.Build();
        }

        /// <summary>
        /// Gets the settings.
        /// </summary>
        /// <param name="dir">The dir.</param>
        /// <returns>AppSettings.</returns>
        public static AppSettings GetSettings(string dir)
        {
            return GetSettings(dir, null);
        }

        /// <summary>
        /// Gets the settings.
        /// </summary>
        /// <param name="dir">The dir.</param>
        /// <param name="environmentName">Name of the environment.</param>
        /// <returns>AppSettings.</returns>
        public static AppSettings GetSettings(string dir, string environmentName)
        {
            var config = GetConfiguration(dir, environmentName);
            return GetSettings(config);
        }

        /// <summary>
        /// Gets the settings.
        /// </summary>
        /// <param name="config">The configuration.</param>
        /// <returns>AppSettings.</returns>
        public static AppSettings GetSettings(IConfiguration config)
        {
            return config.Get<AppSettings>();
        }

        /// <summary>
        /// Class LoggingSettings.
        /// </summary>
        public class LoggingSettings
        {
            /// <summary>
            /// Class LogLevelSettings.
            /// </summary>
            public class LogLevelSettings
            {
                /// <summary>
                /// Gets or sets the default.
                /// </summary>
                /// <value>The default.</value>
                public string Default { get; set; }

                /// <summary>
                /// Gets or sets the microsoft logs.
                /// </summary>
                /// <value>The microsoft.</value>
                public string Microsoft { get; set; }

                /// <summary>
                /// Gets or sets the System logs.
                /// </summary>
                /// <value>The microsoft.</value>
                public string System { get; set; }
            }
        }

        /// <summary>
        /// Class ApplicationInsightsSettings.
        /// </summary>
        public class ApplicationInsightsSettings
        {
            /// <summary>
            /// Gets or sets the instrumentation key.
            /// </summary>
            /// <value>The instrumentation key.</value>
            public string InstrumentationKey { get; set; }

            /// <summary>
            /// Gets or sets the log level.
            /// </summary>
            /// <value>The log level.</value>
            public LoggingSettings.LogLevelSettings LogLevel { get; set; }
        }

        /// <summary>
        /// Class CosmosDbSettings.
        /// </summary>
        public class CosmosDbSettings
        {
            /// <summary>
            /// Gets or sets the Cosmos DB Connection string.
            /// </summary>
            /// <value>The endpoint URL.</value>
            public string ConnectionString { get; set; }

            /// <summary>
            /// Gets or sets the name of the database.
            /// </summary>
            /// <value>The name of the database.</value>
            public string DatabaseName { get; set; }
        }

        /// <summary>
        /// Class AzureAD Settings.
        /// </summary>
        public class AzureADSettings
        {
            /// <summary>
            /// Gets or sets the Tenant ID for the Azure AD app registration.
            /// </summary>
            /// <value>The tenant id.</value>
            public string TenantId { get; set; }

            /// <summary>
            /// Gets or sets the App ID for the Azure AD app registration.
            /// </summary>
            /// <value>The app id.</value>
            public string AppId { get; set; }

            /// <summary>
            /// Gets or sets the App AppSecret/Secret for the Azure AD app registration.
            /// </summary>
            /// <value>The app password.</value>
            public string AppPassword { get; set; }

            /// <summary>
            /// Gets or sets the Host Domain for the Azure AD app registration that is also the permission scope prefix.
            /// </summary>
            /// <value>The name of the host domain.</value>
            public string HostDomain { get; set; }

            /// <summary>
            /// Gets or sets the Scope Name for the Azure AD app registration.
            /// </summary>
            /// <value>The name of the scope.</value>
            public string Scope { get; set; }
        }
    }
}
