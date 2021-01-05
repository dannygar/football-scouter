// ***********************************************************************
// Assembly         : ScouterApi
// Author           : dannygar
// Created          : 09-01-2020
//
// Last Modified By : dannygar
// Last Modified On : 09-01-2020
// ***********************************************************************
// <copyright file="CosmosUtil.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.TXT file in the project root for full license information.
// </copyright>
// <summary></summary>
// ***********************************************************************

namespace ScouterApi.Utils
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.Azure.Cosmos;
    using ScouterApi.Configuration;
    using ScouterApi.Services;
    using ScouterApi.Utils.Bulk;

    /// <summary>
    /// Class CosmosUtil.
    /// Implements the <see cref="ScouterApi.Services.ICosmosDbService{T}" />.
    /// </summary>
    /// <typeparam name="T">A model type.</typeparam>
    /// <seealso cref="ScouterApi.Services.ICosmosDbService{T}" />
    public sealed class CosmosUtil<T> : ICosmosDbService<T>, IDisposable
    {
        /// <summary>
        /// The default partition key.
        /// </summary>
        private const string DefaultPartitionKey = "/id";

        /// <summary>
        /// The client.
        /// </summary>
        private CosmosClient client;

        /// <summary>
        /// The database.
        /// </summary>
        private Database database;

        /// <summary>
        /// The container.
        /// </summary>
        private Container container;

        /// <summary>
        /// Initializes a new instance of the <see cref="CosmosUtil{T}" /> class.
        /// </summary>
        /// <param name="containerName">Name of the container.</param>
        /// <param name="partitionKey">The partition key.</param>
        /// <param name="throughput">The throughput.</param>
        public CosmosUtil(string containerName, string partitionKey = DefaultPartitionKey, int throughput = 400)
        {
            var appSettings = AppSettings.GetSettings(Directory.GetCurrentDirectory());
            this.CreateDatabase(containerName, appSettings, partitionKey, throughput).ConfigureAwait(false).GetAwaiter().GetResult();
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="CosmosUtil{T}" /> class.
        /// </summary>
        /// <param name="containerName">Name of the container.</param>
        /// <param name="appSettings">The application settings.</param>
        /// <param name="partitionKey">The partition key.</param>
        /// <param name="throughput">The throughput.</param>
        public CosmosUtil(string containerName, AppSettings appSettings, string partitionKey = DefaultPartitionKey, int throughput = 400)
        {
            this.CreateDatabase(containerName, appSettings, partitionKey, throughput).ConfigureAwait(false).GetAwaiter().GetResult();
        }


        /// <summary>
        /// get items as an asynchronous operation.
        /// </summary>
        /// <param name="queryDefinition">The query definition.</param>
        /// <param name="partitionKey"></param>
        /// <returns>IEnumerable&lt;T&gt;.</returns>
        public async Task<IEnumerable<T>> GetItemsAsync(QueryDefinition queryDefinition, string partitionKey)
        {
            var results = new List<T>();
            using (FeedIterator<T> feedIterator = this.container.GetItemQueryIterator<T>(
                queryDefinition,
                null,
                new QueryRequestOptions() { PartitionKey = new PartitionKey(partitionKey) }))
            {
                while (feedIterator.HasMoreResults)
                {
                    FeedResponse<T> response = await feedIterator.ReadNextAsync();
                    results.AddRange(response.ToList());
                }
            }

            return results;
        }

        /// <summary>
        /// get items as an asynchronous operation.
        /// </summary>
        /// <param name="queryString">The query string.</param>
        /// <returns>IEnumerable&lt;T&gt;.</returns>
        public async Task<IEnumerable<T>> GetItemsAsync(string queryString)
        {
            var query = this.container.GetItemQueryIterator<T>(new QueryDefinition(queryString));
            var results = new List<T>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            return results;
        }

        /// <summary>
        /// get item as an asynchronous operation.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="partitionKey">The partition key.</param>
        /// <returns>T.</returns>
        public async Task<T> GetItemAsync(string id, string partitionKey)
        {
            try
            {
                var response = await this.container.ReadItemAsync<T>(id, new PartitionKey(partitionKey));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return default(T);
            }
        }




        /// <summary>
        /// add item as an asynchronous operation.
        /// </summary>
        /// <param name="item">The item.</param>
        /// <param name="partitionKey">The partition key.</param>
        /// <returns>Task.</returns>
        public async Task AddItemAsync(T item, string partitionKey = DefaultPartitionKey)
        {
            if (partitionKey == DefaultPartitionKey)
            {
                await this.container.CreateItemAsync<T>(item);
            }
            else
            {
                await this.container.CreateItemAsync<T>(item, new PartitionKey(partitionKey));
            }
        }

        /// <summary>
        /// Replace item as an asynchronous operation.
        /// </summary>
        /// <param name="item">The item.</param>
        /// <param name="id"></param>
        /// <param name="partitionKey">The partition key.</param>
        /// <returns>Task.</returns>
        public async Task ReplaceItemAsync(T item, string id, string partitionKey = DefaultPartitionKey)
        {
            if (partitionKey == DefaultPartitionKey)
            {
                await this.container.ReplaceItemAsync<T>(item, id);
            }
            else
            {
                await this.container.ReplaceItemAsync<T>(item, id, new PartitionKey(partitionKey));
            }
        }

        /// <summary>
        /// upsert item as an asynchronous operation.
        /// </summary>
        /// <param name="item">The item.</param>
        /// <param name="partitionKey">The partition key.</param>
        /// <returns>Task.</returns>
        public async Task UpsertItemAsync(T item, string partitionKey = DefaultPartitionKey)
        {
            if (partitionKey == DefaultPartitionKey)
            {
                await this.container.UpsertItemAsync(item);
            }
            else
            {
                await this.container.UpsertItemAsync<T>(item, new PartitionKey(partitionKey));
            }
        }


        /// <summary>
        /// Bulk Upsert Task execution
        /// </summary>
        /// <param name="items"></param>
        /// <param name="partitionKey"></param>
        /// <returns></returns>
        public async Task<BulkOperationResponse<T>> UpsertArrayAsync(IList<T> items, string partitionKey = DefaultPartitionKey)
        {
            BulkOperations<T> bulkOperations = new BulkOperations<T>(items.Count);
            if (partitionKey == DefaultPartitionKey)
            {
                foreach (T document in items)
                {
                    bulkOperations.Tasks.Add(container.UpsertItemAsync(document).CaptureOperationResponse(document));
                }
            }
            else
            {
                foreach (T document in items)
                {
                    bulkOperations.Tasks.Add(container.UpsertItemAsync<T>(document, new PartitionKey(partitionKey)).CaptureOperationResponse(document));
                }
            }

            // Execute all tasks
            return await bulkOperations.ExecuteAsync();
        }

        /// <summary>
        /// delete item as an asynchronous operation.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="partitionKey">The partition key.</param>
        /// <returns>Task.</returns>
        public async Task DeleteItemAsync(string id, string partitionKey)
        {
            await this.container.DeleteItemAsync<T>(id, new PartitionKey(partitionKey));
        }

        /// <summary>
        /// delete container as an asynchronous operation.
        /// </summary>
        /// <param name="containerName">Name of the container.</param>
        /// <returns>A <see cref="Task"/> representing the work of deleting the container.</returns>
        public async Task DeleteContainerAsync(string containerName)
        {
            var container = this.database.GetContainer(containerName);
            await container.DeleteContainerAsync();
        }

        /// <summary>
        /// delete database as an asynchronous operation.
        /// </summary>
        /// <returns>A <see cref="Task"/> representing the work of deleting the database.</returns>
        public async Task DeleteDatabaseAsync()
        {
            await this.database.DeleteAsync();
        }

        /// <summary>
        /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
        /// </summary>
        public void Dispose()
        {
            this.client?.Dispose();
        }

        /// <summary>
        /// Updates a cosmosdb connectionstr with a new endpoint address" /> class.
        /// </summary>
        /// <param name="appSettingsConnectionString">The connection str read from app settings.</param>
        /// <param name="cosmosEndPoint">The new cosmos db endpoint to update the connection str with.</param>
        /// <returns>string.</returns>
        private string UpdateConnectionStrForCosmosEmulator(string appSettingsConnectionString, string cosmosEndPoint)
        {
            const string accountKeyIdentifer = "AccountKey";
            var accountKey = appSettingsConnectionString.Substring(appSettingsConnectionString.IndexOf(accountKeyIdentifer) + accountKeyIdentifer.Length + 1);
            var connectionString = "AccountEndpoint=" + cosmosEndPoint + ";AccountKey=" + accountKey;

            return connectionString;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="CosmosUtil{T}" /> class.
        /// </summary>
        /// <param name="containerName">Name of the container.</param>
        /// <param name="appSettings">The application settings.</param>
        /// <param name="partitionKey">The partition key.</param>
        /// <param name="throughput">The throughput.</param>
        /// <returns>System.Threading.Tasks.Task.</returns>
        private async Task CreateDatabase(string containerName, AppSettings appSettings, string partitionKey, int throughput)
        {
            var connectionString = appSettings.CosmosDb.ConnectionString;
            var databaseName = appSettings.CosmosDb.DatabaseName;

            // azdo pipeline will set the cosmos db url as an env variable
            var cosmosEndPoint = Environment.GetEnvironmentVariable("COSMOSDBEMULATOR_ENDPOINT");
            if (connectionString.Contains("localhost") && cosmosEndPoint != null)
            {
                connectionString = this.UpdateConnectionStrForCosmosEmulator(connectionString, cosmosEndPoint);
            }

            // Initialize Cosmos Client
            this.client = new CosmosClient(connectionString, new CosmosClientOptions() { AllowBulkExecution = true });

            // Create a new Database if not exists
            var databaseResponse = await this.client.CreateDatabaseIfNotExistsAsync(databaseName);

            // Get the current database
            this.database = databaseResponse.Database;

            // Create a new container if not exists
            await this.database.CreateContainerIfNotExistsAsync(containerName, partitionKey, throughput);

            // Initialize the container
            this.container = this.client.GetContainer(databaseName, containerName);
        }
    }
}
