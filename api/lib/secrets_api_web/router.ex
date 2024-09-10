defmodule SecretsApiWeb.Router do
  use SecretsApiWeb, :router

  import Phoenix.LiveDashboard.Router

  pipeline :api do
    plug :accepts, ["json"]
    plug CORSPlug
  end

  scope "/api", SecretsApiWeb do
    pipe_through :api

    head "/secrets/:id", SecretsController, :head
    resources "/secrets", SecretsController, only: [:show, :create, :delete]
    resources "/stats", StatsController, only: [:index]

    options "/*path", SecretsController, :options
  end

  scope "/" do
    pipe_through [:fetch_session, :protect_from_forgery]

    live_dashboard "/dashboard", metrics: SecretsApiWeb.Telemetry
  end
end
