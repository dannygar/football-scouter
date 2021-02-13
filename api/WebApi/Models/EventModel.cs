// <copyright file="FacilityState.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.TXT file in the project root for full license information.
// </copyright>

namespace ScouterApi.Models
{
    using System;
    using System.Collections.Generic;
    using System.Runtime.Serialization;
    using Scouter.Common;

    /// <summary>
    /// Model that describes the Significant Event.
    /// </summary>
    public class EventModel : BaseModel
    {
        /// <summary>
        /// Gets or sets User's account.
        /// </summary>
        [DataMember(Name = "account")]
        public string Account { get; set; }

        /// <summary>
        /// Gets or sets User's email.
        /// </summary>
        [DataMember(Name = "email")]
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets Game Id.
        /// </summary>
        [DataMember(Name = "gameId")]
        public Guid GameId { get; set; }

        /// <summary>
        /// Gets or sets Master indication.
        /// </summary>
        [DataMember(Name = "isMaster")]
        public bool IsMaster { get; set; }

        /// <summary>
        ///  Gets or sets the Events.
        /// </summary>
        [DataMember(Name = "events")]
        public List<SignificantEvent> Events { get; set; }

    }
}
