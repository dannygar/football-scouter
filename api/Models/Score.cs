// <copyright file="FacilityState.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.TXT file in the project root for full license information.
// </copyright>

namespace ScouterApi.Models
{
    using System;
    using System.Collections.Generic;
    using System.Runtime.Serialization;

    /// <summary>
    /// Model that describes the Significant Event.
    /// </summary>
    public class Score : BaseModel
    {
        /// <summary>
        /// Gets or sets Agent.
        /// </summary>
        [DataMember(Name = "agent")]
        public Agent Agent { get; set; }

        /// <summary>
        /// Gets or sets Game.
        /// </summary>
        [DataMember(Name = "game")]
        public Game Game { get; set; }

        /// <summary>
        ///  Gets or sets the Events.
        /// </summary>
        [DataMember(Name = "events")]
        public List<SignificantEvent> Events { get; set; }

    }
}
