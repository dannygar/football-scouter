
namespace ScouterApi.Mappings
{
    using AutoMapper;
    using ScouterApi.Resolvers;

    /// <summary>
    /// MappingProfile
    /// </summary>
    public class MappingProfile : Profile
    {
        /// <summary>
        /// Default Constructor
        /// </summary>
        public MappingProfile()
        {
            CreateMap<Scouter.Data.EventModel, ScouterApi.Models.EventModel>(); // Map Data EventModel to API EventModel
            CreateMap<ScouterApi.Models.EventModel, Scouter.Data.EventModel>(); // Map Api EventModel to Data EventModel

            CreateMap<Scouter.Data.SignificantEvent, ScouterApi.Models.SignificantEvent>(); // Map Data SignificantEvent to API SignificantEvent
            CreateMap<ScouterApi.Models.SignificantEvent, Scouter.Data.SignificantEvent>() // Map Api SignificantEvent to Data SignificantEvent
                .ForMember(dest => dest.ProcessedTime, source => source.MapFrom<ProcessedTimeResolver>());

        }
    }
}
