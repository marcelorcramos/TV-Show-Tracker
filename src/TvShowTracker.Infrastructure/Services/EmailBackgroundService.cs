using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using TvShowTracker.Application.Interfaces;

namespace TvShowTracker.Infrastructure.Services
{
    public class EmailBackgroundService : BackgroundService
    {
        private readonly ILogger<EmailBackgroundService> _logger;
        private readonly IServiceProvider _serviceProvider;
        private readonly TimeSpan _interval = TimeSpan.FromDays(7);

        public EmailBackgroundService(ILogger<EmailBackgroundService> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Email Background Service started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await SendWeeklyRecommendationsAsync();
                    _logger.LogInformation("Weekly recommendation emails sent successfully.");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred sending recommendation emails.");
                }

                await Task.Delay(_interval, stoppingToken);
            }
        }

        private async Task SendWeeklyRecommendationsAsync()
        {
            using var scope = _serviceProvider.CreateScope();
            var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
            var recommendationService = scope.ServiceProvider.GetRequiredService<IRecommendationService>();
            _logger.LogInformation("Sending weekly recommendation emails...");
            
            await Task.CompletedTask;
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Email Background Service is stopping.");
            await base.StopAsync(cancellationToken);
        }
    }
}