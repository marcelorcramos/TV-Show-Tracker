using AutoMapper;
using TvShowTracker.Application.DTOs;
using TvShowTracker.Domain.Entities;

namespace TvShowTracker.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User mappings
            CreateMap<User, UserDto>();
            CreateMap<CreateUserDto, User>();

            // TV Show mappings
            CreateMap<TvShow, TvShowDto>()
                .ForMember(dest => dest.IsFavorite, opt => opt.Ignore())
                .ForMember(dest => dest.FeaturedActors, opt => opt.Ignore());

            CreateMap<TvShow, TvShowDetailDto>()
                .IncludeBase<TvShow, TvShowDto>()
                .ForMember(dest => dest.Episodes, opt => opt.Ignore())
                .ForMember(dest => dest.FeaturedActors, opt => opt.Ignore());
            
            // Actor mappings
            CreateMap<Actor, ActorDto>()
            .ForMember(dest => dest.BirthDate, opt => opt.MapFrom(src => src.BirthDate))
            .ForMember(dest => dest.Nationality, opt => opt.MapFrom(src => src.Nationality))
            .ForMember(dest => dest.Bio, opt => opt.MapFrom(src => src.Bio))
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.ImageUrl));

            // Episode mappings
            CreateMap<Episode, EpisodeDto>();
        }
    }
}