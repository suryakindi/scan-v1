<?php

namespace App\Providers;

use App\Http\Controllers\MasterDataController;
use App\Models\BaseUrl;
use Illuminate\Support\ServiceProvider;

use App\Services\{BaseUrlService, BPJSToolsService, UserService, ManagementClientService, PermissionService, MasterDataService};
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
        $this->app->singleton(BaseUrlService::class, function ($app) {
            return new BaseUrlService();
        });
        $this->app->singleton(BPJSToolsService::class, function ($app) {
            return new BPJSToolsService();
        });
        $this->app->singleton(PermissionService::class, function ($app) {
            return new PermissionService();
        });
        $this->app->singleton(MasterDataService::class, function ($app) {
            return new MasterDataService();
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
