{
  lib,
  config,
  dream2nix,
  ...
}: {
  imports = [
    dream2nix.modules.dream2nix.nodejs-package-lock-v3
    dream2nix.modules.dream2nix.nodejs-granular-v3
    dream2nix.modules.dream2nix.nodejs-devshell-v3
  ];

  mkDerivation = {
    src = builtins.fetchGit {
      shallow = true;
      url = "https://github.com/MrTipson/banked-rank-it";
      ref = "v0.0.1";
      rev = "b77bcbf2dd1b0956072fff6ee971bd59a65a72af";
    };
  };

  deps = {nixpkgs, ...}: {
    inherit
      (nixpkgs)
      fetchFromGitHub
      stdenv
      ;
  };

  nodejs-package-lock-v3 = {
    packageLockFile = "${config.mkDerivation.src}/package-lock.json";
  };

  name = "banked-rank-it";
  version = "0.0.1";
}