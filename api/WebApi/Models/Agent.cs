
namespace ScouterApi.Models
{
    using Scouter.Common;
    using System.Runtime.Serialization;

    public class Agent : BaseModel
    {
        [DataMember(Name = "userName")]
        public string UserName { get; set; }

        [DataMember(Name = "displayName")]
        public string DisplayName { get; set; }
    }
}
