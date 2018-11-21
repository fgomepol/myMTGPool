import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()

export class ExcelService {
  constructor() { }
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);

    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.r; C <= range.e.r; ++C) {
      const address = XLSX.utils.encode_col(C) + '1'; // <-- first row, column number C
      if (!worksheet[address]) {
        continue;
      } else {
        worksheet[address].v = worksheet[address].v.toUpperCase();
      }
    }

    // console.log(worksheet);

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
     const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
     FileSaver.saveAs(data, fileName  + new  Date().getTime() + EXCEL_EXTENSION);
  }
}
