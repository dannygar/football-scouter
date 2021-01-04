// <copyright file="FacilityState.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.TXT file in the project root for full license information.
// </copyright>

namespace ScouterApi.Models
{
    using System;
    using System.Runtime.Serialization;

    /// <summary>
    /// Model that describes the Significant Event.
    /// </summary>
    public class SignificantEvent
    {
        /// <summary>
        /// Gets or sets Event Id.
        /// </summary>
        [DataMember(Name = "id")]
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets EventTime
        /// </summary>
        [DataMember(Name = "time")]
        public string EventTime { get; set; }

        /// <summary>
        /// Gets or sets AdvTeam
        /// </summary>
        [DataMember(Name = "advTeam")]
        public string AdvTeam { get; set; }

        /// <summary>
        /// Gets or sets Event Type
        /// </summary>
        [DataMember(Name = "eventType")]
        public uint EventType { get; set; }

        /// <summary>
        /// Gets or sets Position
        /// </summary>
        [DataMember(Name = "position")]
        public uint Position { get; set; }

        /// <summary>
        /// Gets or sets Significance
        /// </summary>
        [DataMember(Name = "significance")]
        public uint Significance { get; set; }

        /// <summary>
        /// Gets or sets Credit
        /// </summary>
        [DataMember(Name = "credit")]
        public string Credit { get; set; }

        /// <summary>
        /// Gets or sets Blame
        /// </summary>
        [DataMember(Name = "blame")]
        public string Blame { get; set; }

        /// <summary>
        /// Gets or sets Credit
        /// </summary>
        [DataMember(Name = "comments")]
        public string Comments { get; set; }
    }
}
