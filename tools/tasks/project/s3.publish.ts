import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import Config from '../../config';
import { readFileSync } from 'fs';
import { makeTsProject, TemplateLocalsBuilder } from '../../utils';

const plugins = <any>gulpLoadPlugins();


/**
 * Publish the main js file to Amazon S3 bucket.
 */
function publishToS3() {
  var aws: any = readFileSync('./aws-keys.json');
  aws = JSON.parse(aws);
  return gulp.src('./dist/prod/js/**')
    .pipe(plugins.s3(aws));
}

export = () => publishToS3();
