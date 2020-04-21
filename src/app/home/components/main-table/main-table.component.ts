import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ColumnType, IncomingDataOfAvailableColumns, MainTableService } from '../../services/main-table.service';

@Component({
  selector: 'app-main-table',
  templateUrl: './main-table.component.html',
  styleUrls: ['./main-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MainTableComponent implements OnInit {

  availableColumns: ColumnType[];
  columnsPropertiesForRows: string[] = [];
  daysOfTheWeek: ColumnType[];
  dataSource: MatTableDataSource<IncomingDataOfAvailableColumns>;
  expandedElement: IncomingDataOfAvailableColumns | null;
  isLoading: boolean;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private mainTableService: MainTableService
  ) {
    // this.availableColumns = this.availableColumns.concat(this.daysOfTheWeek);
    // this.availableColumns.forEach(columnProperty => {
    //   this.columnsPropertiesForRows.push(columnProperty.propertyName);
    // })

    // Create 100 users
    // const randomTimeEntries = Array.from({length: 100}, () => createNewRandomTimeEntry());

    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(randomTimeEntries);
  }

  ngOnInit() {
    // this.isLoading = true;

    this.mainTableService.getMainRows()
      .subscribe(data => {
        this.availableColumns = data;
        this.availableColumns.forEach(columnProperty => {
          this.columnsPropertiesForRows.push(columnProperty.propertyName);
        })
        console.log('availableColumns :', data);
    });

    this.mainTableService.getDaysOfTheWeek()
      .subscribe(data => {
        this.daysOfTheWeek = data;
        console.log('daysOfTheWeek :', data);
    });

    this.mainTableService.getMainTableData()
      .subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        console.log('dataSource :', data);
    });

    setTimeout(() => {
      // this.isLoading = false;
    }, 2000);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
