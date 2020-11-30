using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace ScouterApi.Models
{
    /// <summary>
    ///  Game model
    /// </summary>
    public class Game: BaseModel
    {
        [DataMember(Name = "homeTeam")]
        public string HomeTeam { get; set; }

        [DataMember(Name = "awayTeam")]
        public string AwayTeam { get; set; }

        [DataMember(Name = "playedOn")]
        public DateTimeOffset PlayedOn { get; set; }

        [DataMember(Name = "fullGame")]
        public bool FullGame { get; set; }

        [DataMember(Name = "leagueName")]
        public string LeagueName { get; set; }

    }
}
