<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Services\{UserService, ManagementClientService};
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(UserService::class, function ($app) {
            return new UserService();
        });
        $this->app->singleton(ManagementClientService::class, function ($app) {
            return new ManagementClientService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
