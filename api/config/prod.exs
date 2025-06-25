import Config

config :secrets_api, SecretsApiWeb.Endpoint,
  url: [host: "example.com", port: 80],
  check_origin: false

config :logger, level: :info
