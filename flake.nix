{
  description = "banked-rank-it devshell and package";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    dream2nix.url = "github:nix-community/dream2nix";
  };

  outputs = { self, nixpkgs, flake-utils, dream2nix }:
    flake-utils.lib.eachDefaultSystem (system:
      {
        packages = {
          default = dream2nix.lib.evalModules {
            packageSets.nixpkgs = nixpkgs.legacyPackages.${system};
            modules = [ ./default.nix ];
          };
        };
      }
    );
}
