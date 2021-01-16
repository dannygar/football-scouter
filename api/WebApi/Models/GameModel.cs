
namespace ScouterApi.Models
{
    using Scouter.Common;
    using System.Runtime.Serialization;

    /// <summary>
    ///  IGame model
    /// </summary>
    public class IGame: BaseModel
    {
        [DataMember(Name = "homeTeam")]
        public string HomeTeam { get; set; }

        [DataMember(Name = "awayTeam")]
        public string AwayTeam { get; set; }

        [DataMember(Name = "playedOn")]
        public string PlayedOn { get; set; }

        [DataMember(Name = "fullGame")]
        public bool FullGame { get; set; }

        [DataMember(Name = "league")]
        public string League { get; set; }

    }
}
