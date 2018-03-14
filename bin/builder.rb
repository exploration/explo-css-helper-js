class Builder
  def initialize
    @base_dir = File.join(File.dirname(__FILE__), '..')
    @template_file_path = File.join(@base_dir, 'lib', 'explo_css_helper.template.js')
    @dist_file_path = File.join(@base_dir, 'dist', 'explo_css_helper.js')

    @css_helper_template = File.read(@template_file_path)
  end

  def build
    puts 'building distribution...'
    File.open(@dist_file_path, 'w') do |file|
      file.puts @css_helper_template
      file.puts ''
      file.puts css_definitions_template
    end
    puts "#{@dist_file_path} built."
  end

  def css_definitions_template
    definitions =
      File.read \
        File.join(@base_dir, 'explo-css-styles-classes', 'explo_styles.json')
    <<~JSON_CLASS
      class ExploCSSDefinitions {
        static json() {
          return #{definitions}
        }
      }
    JSON_CLASS
  end

  def template_is_modified?
    @template_ts = File.stat(@template_file_path).mtime.to_i
    status = 
      if @previous_template_ts
        (@template_ts - @previous_template_ts) > 0
      else
        false
      end
    @previous_template_ts = @template_ts
    return status
  end

  def trap_interrupt
    Signal.trap('INT') do
      puts 'Exiting...'
      exit
    end
  end

  def watch
    puts 'Watching JS template for changes. Press CTRL-C to quit...'
    while true
      trap_interrupt
      if template_is_modified?
        print 'File modified, '
        build
      end
      sleep 1
    end
  end
end
