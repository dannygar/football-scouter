using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace ScouterApi.Models
{
    public class GoldCircleModel
    {
        /// <summary>
        /// Gets or sets Game Id.
        /// </summary>
        [DataMember(Name = "gameId")]
        public Guid GameId { get; set; }

        [DataMember(Name = "agentIds")]
        public IEnumerable<string> AgentIds { get; set; }


    }
}
