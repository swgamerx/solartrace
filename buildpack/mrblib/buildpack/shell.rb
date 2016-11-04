module Buildpack
  module Shell
    def system(command)
      output = nil

      IO.popen(command) do |io|
        output = io.read
      end

      [output, $?]
    end

    def pipe(command)
      IO.popen(command) do |io|
        while data = io.read(1)
          @output_io.print data
        end
      end

      $?
    end

    def command_success?(command)
      _, status = system(command)
      status.success?
    end

    def mktmpdir(name = "fetcher")
      tmpfile = Tempfile.new(name)
      dir = tmpfile.path
      tmpfile.unlink

      FileUtilsSimple.mkdir_p(dir)
      yield dir
    ensure
      FileUtilsSimple.rm_rf(dir) if File.exist?(dir)
    end
  end
end
