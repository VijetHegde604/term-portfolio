{
  description = "Terminal Portfolio Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_24
          ];

          shellHook = ''
            echo "🚀 Terminal Portfolio Dev Shell Ready!"
            echo "Node.js: $(node --version)"
            echo "NPM:     $(npm --version)"
            echo "Run 'npm run dev' to start the local Vite development server."
          '';
        };
      }
    );
}
