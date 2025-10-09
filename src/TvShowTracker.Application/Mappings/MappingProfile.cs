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
            CreateMap<TvShow, TvShowDto>();
            CreateMap<TvShow, TvShowDetailDto>();
            
            // Actor mappings
            CreateMap<Actor, ActorDto>();

            // Episode mappings
            CreateMap<Episode, EpisodeDto>();
        }
    }
}
