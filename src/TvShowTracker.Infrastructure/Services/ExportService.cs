using CsvHelper;
using System.Globalization;
using System.Text;
using TvShowTracker.Application.DTOs;
using TvShowTracker.Application.Interfaces;
using TvShowTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace TvShowTracker.Infrastructure.Services
{
    public class ExportService : IExportService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ITvShowService _tvShowService;

        public ExportService(ApplicationDbContext context, IMapper mapper, ITvShowService tvShowService)
        {
            _context = context;
            _mapper = mapper;
            _tvShowService = tvShowService;
            
            // Set QuestPDF license (free for open source)
            QuestPDF.Settings.License = LicenseType.Community;
        }

        public async Task<byte[]> ExportTvShowsToCsvAsync(TvShowQuery query)
        {
            var result = await _tvShowService.GetTvShowsAsync(query);
            
            using var memoryStream = new MemoryStream();
            using var writer = new StreamWriter(memoryStream, Encoding.UTF8);
            using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
            
            // Write header
            csv.WriteField("ID");
            csv.WriteField("Title");
            csv.WriteField("Genre");
            csv.WriteField("Type");
            csv.WriteField("ReleaseDate");
            csv.WriteField("Seasons");
            csv.WriteField("Rating");
            csv.NextRecord();
            
            // Write data
            foreach (var show in result.Items)
            {
                csv.WriteField(show.Id);
                csv.WriteField(show.Title);
                csv.WriteField(show.Genre ?? "N/A");
                csv.WriteField(show.Type ?? "N/A");
                csv.WriteField(show.ReleaseDate?.ToString("yyyy-MM-dd") ?? "N/A");
                csv.WriteField(show.Seasons?.ToString() ?? "N/A");
                csv.WriteField(show.Rating?.ToString("0.0") ?? "N/A");
                csv.NextRecord();
            }
            
            await writer.FlushAsync();
            return memoryStream.ToArray();
        }

        public async Task<byte[]> ExportTvShowsToPdfAsync(TvShowQuery query)
        {
            var result = await _tvShowService.GetTvShowsAsync(query);
            
            var pdfBytes = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(12));
                    
                    page.Header()
                        .AlignCenter()
                        .Text("TV Shows Export")
                        .SemiBold().FontSize(24).FontColor(Colors.Blue.Medium);
                    
                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.ConstantColumn(30); // ID
                                columns.RelativeColumn(3); // Title
                                columns.RelativeColumn(2); // Genre
                                columns.RelativeColumn(2); // Type
                                columns.RelativeColumn(2); // Rating
                            });
                            
                            table.Header(header =>
                            {
                                header.Cell().Text("ID").SemiBold();
                                header.Cell().Text("Title").SemiBold();
                                header.Cell().Text("Genre").SemiBold();
                                header.Cell().Text("Type").SemiBold();
                                header.Cell().Text("Rating").SemiBold();
                            });
                            
                            foreach (var show in result.Items)
                            {
                                table.Cell().Text(show.Id.ToString());
                                table.Cell().Text(show.Title);
                                table.Cell().Text(show.Genre ?? "N/A");
                                table.Cell().Text(show.Type ?? "N/A");
                                table.Cell().Text(show.Rating?.ToString("0.0") ?? "N/A");
                            }
                        });
                    
                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Page ");
                            x.CurrentPageNumber();
                            x.Span(" of ");
                            x.TotalPages();
                            x.Span($" - Generated on {DateTime.Now:yyyy-MM-dd HH:mm}");
                        });
                });
            }).GeneratePdf();
            
            return pdfBytes;
        }

        public async Task<byte[]> ExportUserFavoritesToCsvAsync(int userId)
        {
            var favorites = await _context.UserFavorites
                .Where(uf => uf.UserId == userId)
                .Include(uf => uf.TvShow)
                .Select(uf => uf.TvShow)
                .ToListAsync();
            
            using var memoryStream = new MemoryStream();
            using var writer = new StreamWriter(memoryStream, Encoding.UTF8);
            using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
            
            csv.WriteField("ID");
            csv.WriteField("Title");
            csv.WriteField("Genre");
            csv.WriteField("Type");
            csv.WriteField("Rating");
            csv.WriteField("AddedToFavorites");
            csv.NextRecord();
            
            foreach (var show in favorites)
            {
                csv.WriteField(show.Id);
                csv.WriteField(show.Title);
                csv.WriteField(show.Genre ?? "N/A");
                csv.WriteField(show.Type ?? "N/A");
                csv.WriteField(show.Rating?.ToString("0.0") ?? "N/A");
                csv.WriteField(DateTime.UtcNow.ToString("yyyy-MM-dd"));
                csv.NextRecord();
            }
            
            await writer.FlushAsync();
            return memoryStream.ToArray();
        }

        public async Task<byte[]> ExportUserFavoritesToPdfAsync(int userId)
        {
            var favorites = await _context.UserFavorites
                .Where(uf => uf.UserId == userId)
                .Include(uf => uf.TvShow)
                .Select(uf => uf.TvShow)
                .ToListAsync();
            
            var user = await _context.Users.FindAsync(userId);
            var userName = user?.Name ?? "User";
            
            var pdfBytes = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(12));
                    
                    page.Header()
                        .AlignCenter()
                        .Text($"{userName}'s Favorite TV Shows")
                        .SemiBold().FontSize(24).FontColor(Colors.Blue.Medium);
                    
                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.ConstantColumn(30); // ID
                                columns.RelativeColumn(3); // Title
                                columns.RelativeColumn(2); // Genre
                                columns.RelativeColumn(2); // Type
                                columns.RelativeColumn(2); // Rating
                            });
                            
                            table.Header(header =>
                            {
                                header.Cell().Text("ID").SemiBold();
                                header.Cell().Text("Title").SemiBold();
                                header.Cell().Text("Genre").SemiBold();
                                header.Cell().Text("Type").SemiBold();
                                header.Cell().Text("Rating").SemiBold();
                            });
                            
                            foreach (var show in favorites)
                            {
                                table.Cell().Text(show.Id.ToString());
                                table.Cell().Text(show.Title);
                                table.Cell().Text(show.Genre ?? "N/A");
                                table.Cell().Text(show.Type ?? "N/A");
                                table.Cell().Text(show.Rating?.ToString("0.0") ?? "N/A");
                            }
                        });
                    
                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Page ");
                            x.CurrentPageNumber();
                            x.Span(" of ");
                            x.TotalPages();
                            x.Span($" - Generated on {DateTime.Now:yyyy-MM-dd HH:mm}");
                        });
                });
            }).GeneratePdf();
            
            return pdfBytes;
        }
    }
}