module Buildpack
  module Shell; end

  class BuildpackRunner
    include Shell

    BUILDKITS_BASE = "https://codon-buildpacks.s3.amazonaws.com/buildpacks"

    def initialize(output_io, error_io, name)
      @output_io = output_io
      @error_io  = error_io
      @name      = name
      @fetcher   = Fetcher.new(BUILDKITS_BASE)
    end

    def run(build_dir, cache_dir, env_dir, exports = [])
      release = {}
      export  = nil

      mktmpdir("buildpack") do |dir|
        Dir.chdir(dir) do
          filename = "#{@name.split("/").last}.tgz"
          @output_io.topic "Fetching buildpack #{@name}"
          @fetcher.fetch("#{@name}.tgz", filename)
          @fetcher.unpack(filename)

          output, status = system("bin/detect #{build_dir}")
          @output_io.topic "#{output.chomp} detected"
          on_error(status, "Could not detect a #{@name} compatible app")
          status = pipe("#{source_exports(exports)} bin/compile #{build_dir} #{cache_dir} #{env_dir}")
          on_error(status, "Failed trying to compile #{@name}")
          output, status = system("#{source_exports(exports)} bin/release #{build_dir}")
          on_error(status, "bin/release failed")
          release = YAML.load(output)
          export  = File.read("export") if File.exist?("export")
        end
      end

      [release, export]
    end

    private
    def on_error(status, message)
      if !status.success?
        @error_io.topic message
        exit status.exitstatus
      end
    end

    def source_exports(exports)
      if exports.any?
        exports.map {|export| ". #{export}" }.join(" && ") + " &&"
      else
        ""
      end
    end
  end
end
