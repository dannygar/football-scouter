
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
            CreateMap<Scouter.Data.EventModelDTO, ScouterApi.Models.EventModel>(); // Map Data EventModel to API EventModel
            CreateMap<ScouterApi.Models.EventModel, Scouter.Data.EventModelDTO>(); // Map Api EventModel to Data EventModel

            CreateMap<Scouter.Data.SignificantEventDTO, ScouterApi.Models.SignificantEvent>(); // Map Data SignificantEvent to API SignificantEvent
            CreateMap<ScouterApi.Models.SignificantEvent, Scouter.Data.SignificantEventDTO>() // Map Api SignificantEvent to Data SignificantEvent
                .ForMember(dest => dest.ProcessedTime, source => source.MapFrom<ProcessedTimeResolver>());

        }
    }
}
