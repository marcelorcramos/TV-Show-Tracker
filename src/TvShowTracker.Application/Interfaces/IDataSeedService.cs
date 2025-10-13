using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TvShowTracker.Application.Interfaces
{
    public interface IDataSeedService
    {
        Task InitializeDatabaseAsync();
        Task ClearDatabaseAsync();
    }
}
