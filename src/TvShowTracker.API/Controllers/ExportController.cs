using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TvShowTracker.Application.Interfaces;

namespace TvShowTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExportController : ControllerBase
    {
        private readonly IExportService _exportService;

        public ExportController(IExportService exportService)
        {
            _exportService = exportService;
        }

        [HttpGet("tvshows/csv")]
        public async Task<IActionResult> ExportTvShowsToCsv(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 1000, 
            [FromQuery] string? genre = null,
            [FromQuery] string? type = null,
            [FromQuery] string? search = null)
        {
            var query = new TvShowQuery
            {
                Page = page,
                PageSize = pageSize,
                Genre = genre,
                Type = type,
                Search = search,
                SortBy = "Title"
            };

            var csvData = await _exportService.ExportTvShowsToCsvAsync(query);
            return File(csvData, "text/csv", $"tvshows-export-{DateTime.Now:yyyyMMdd-HHmmss}.csv");
        }

        [HttpGet("tvshows/pdf")]
        public async Task<IActionResult> ExportTvShowsToPdf(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 1000,
            [FromQuery] string? genre = null,
            [FromQuery] string? type = null,
            [FromQuery] string? search = null)
        {
            var query = new TvShowQuery
            {
                Page = page,
                PageSize = pageSize,
                Genre = genre,
                Type = type,
                Search = search,
                SortBy = "Title"
            };

            var pdfData = await _exportService.ExportTvShowsToPdfAsync(query);
            return File(pdfData, "application/pdf", $"tvshows-export-{DateTime.Now:yyyyMMdd-HHmmss}.pdf");
        }

        [Authorize]
        [HttpGet("favorites/csv")]
        public async Task<IActionResult> ExportFavoritesToCsv()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
            var csvData = await _exportService.ExportUserFavoritesToCsvAsync(userId);
            return File(csvData, "text/csv", $"my-favorites-{DateTime.Now:yyyyMMdd-HHmmss}.csv");
        }

        [Authorize]
        [HttpGet("favorites/pdf")]
        public async Task<IActionResult> ExportFavoritesToPdf()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
            var pdfData = await _exportService.ExportUserFavoritesToPdfAsync(userId);
            return File(pdfData, "application/pdf", $"my-favorites-{DateTime.Now:yyyyMMdd-HHmmss}.pdf");
        }
    }
}