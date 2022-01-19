import { render } from 'react-dom';
import './index.css';
import * as React from 'react';

import { SampleBase } from './sample-base';
import { PropertyPane } from './property-pane';
import { UploaderComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
export class ChunkUpload extends SampleBase {
    constructor(props) {
        super(props);
        this.value = 0;
        this.ddlDatas = [
            { value: 500000, size: '500 KB' },
            { value: 1000000, size: '1 MB' },
            { value: 2000000, size: '2 MB' }
        ];
        this.fields = { text: 'size', value: 'value' };
        this.isInteraction = false;
        this.asyncSettings = {
            saveUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Save',
            removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove',
            chunkSize: 500000
        };
        this.autoUpload = false;
    }
    onChange(args) {
        this.uploadObj.asyncSettings.chunkSize = parseInt(args.itemData.value, 10);
    }
    onRemoveFile(args) {
        args.postRawFile = false;
    }
    // to update flag variable value for automatic pause and resume
    onPausing(args) {
        if (args.event !== null && !navigator.onLine) {
            this.isInteraction = true;
        }
        else {
            this.isInteraction = false;
        }
    }
    // to update flag variable value for automatic pause and resume
    onResuming(args) {
        if (args.event !== null && !navigator.onLine) {
            this.isInteraction = true;
        }
        else {
            this.isInteraction = false;
        }
    }
    // to prevent triggering chunk-upload failure event and to pause uploading on network failure
    onBeforeFailure(args) {
        let proxy = this;
        args.cancel = !this.isInteraction;
        // interval to check network availability on every 500 milliseconds
        let clearTimeInterval = setInterval(function () {
            if (navigator.onLine && !isNullOrUndefined(proxy.uploadObj.filesData[0]) && proxy.uploadObj.filesData[0].statusCode == 4) {
                proxy.uploadObj.resume(proxy.uploadObj.filesData);
                clearSetInterval();
            }
            else {
                if (!proxy.isInteraction && !isNullOrUndefined(proxy.uploadObj.filesData[0]) && proxy.uploadObj.filesData[0].statusCode == 3) {
                    proxy.uploadObj.pause(proxy.uploadObj.filesData);
                }
            }
        }, 500);
        // clear Interval after when network is available.
        function clearSetInterval() {
            clearInterval(clearTimeInterval);
        }
    }
    render() {
        return (<div className='control-pane'>
        <div className='control-section row uploadpreview'>
         <div className='col-lg-8'>
          <div className='upload_wrapper'>
            
            <UploaderComponent id='chunkUpload' type='file' ref={(scope) => { this.uploadObj = scope; }} asyncSettings={this.asyncSettings} autoUpload={this.autoUpload} removing={this.onRemoveFile.bind(this)} pausing={this.onPausing.bind(this)} resuming={this.onResuming.bind(this)} chunkFailure={this.onBeforeFailure.bind(this)}></UploaderComponent>
        </div>
        </div>
        <div className='col-lg-4 property-section' id="chunk-size">
            <PropertyPane title='Properties'>
              <table id="property" title="Properties" className='chunk-table'>
              <tbody>
                <tr>
                  <td className='chunk-td'>Chunk Size</td>
                  <td>
                    <DropDownListComponent id="chunksize" index={this.value} dataSource={this.ddlDatas} ref={(dropdownlist) => { this.listObj = dropdownlist; }} fields={this.fields} change={this.onChange.bind(this)} placeholder="Select chunk size"/>
                  </td>
                </tr>
                </tbody>
              </table>
            </PropertyPane>
          </div>
        </div>
      </div>);
    }
}

render(<ChunkUpload />, document.getElementById('sample'));