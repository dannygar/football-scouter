// ***********************************************************************
// Assembly         : ScouterApi
// Author           : dannygar
// Created          : 09-01-2020
//
// Last Modified By : dannygar
// Last Modified On : 09-01-2020
// ***********************************************************************
// <copyright file="ICosmosDbService.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.TXT file in the project root for full license information.
// </copyright>
// <summary></summary>
// ***********************************************************************

namespace ScouterApi.Services
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    /// <summary>
    /// Interface ICosmosDbService.
    /// </summary>
    /// <typeparam name="T"> A model type.</typeparam>
    public interface ICosmosDbService<T>
    {
        /// <summary>
        /// Gets the items asynchronous.
        /// </summary>
        /// <param name="queryString">The query string.</param>
        /// <returns>Task&lt;IEnumerable&lt;T&gt;&gt;.</returns>
        Task<IEnumerable<T>> GetItemsAsync(string queryString);

        /// <summary>
        /// Gets the item asynchronous.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="partitionKey">The partition key.</param>
        /// <returns>Task&lt;T&gt;.</returns>
        Task<T> GetItemAsync(string id, string partitionKey);

        /// <summary>
        /// Adds the item asynchronous.
        /// </summary>
        /// <param name="item">The item.</param>
        /// <param name="partitionKey">The partition key.</param>
        /// <returns>Task.</returns>
        Task AddItemAsync(T item, string partitionKey);

        /// <summary>
        /// Upserts the item asynchronous.
        /// </summary>
        /// <param name="item">The item.</param>
        /// <param name="partitionKey">The partition key.</param>
        /// <returns>Task.</returns>
        Task UpsertItemAsync(T item, string partitionKey);

        /// <summary>
        /// Deletes the item asynchronous.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="partitionKey">The partition key.</param>
        /// <returns>Task.</returns>
        Task DeleteItemAsync(string id, string partitionKey);
    }
}