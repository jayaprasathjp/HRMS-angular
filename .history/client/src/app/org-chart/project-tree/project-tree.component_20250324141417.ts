import { Component } from '@angular/core';

@Component({
  selector: 'app-project-tree',
  templateUrl: './project-tree.component.html',
  styleUrls: ['./project-tree.component.css']
})
export class ProjectTreeComponent implements OnInit {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  public chart: any;
  public data: any[] = [];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService.getOrgChart().subscribe((data) => {
      this.data = data;
      this.orgchart();
    });
  }

  orgchart() {
    this.chart = new OrgChart().compact(false);
    this.chart
      .container(this.chartContainer.nativeElement)
      .data(this.data)
      .nodeWidth(() => 180)
      .nodeHeight(() => 70)
      .childrenMargin(() => 150)
      .layout('left')
      .nodeContent((d: any) => {
        return `
          <div class="relative shadow-lg w-full h-full rounded-lg 
               text-center flex flex-col justify-center items-center p-2 
               group ${d.depth === 0 ? 'bg-yellow-600 text-white' :
                   d.depth === 1 ? 'bg-yellow-400 text-gray-700' :
                   d.depth === 2 ? 'bg-yellow-300 text-gray-700' : 'bg-yellow-200'}">
           
           ${d.depth === 2 && d.data.info.name ? `
            <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-500 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200
             before:absolute before:content-[''] before:w-0 before:h-0 
                before:border-4 before:border-transparent before:border-t-gray-500 
                before:left-1/2 before:-translate-x-1/2 before:top-full">
              ${d.data.info.description}
            </div>` : ''}
            
            <div class="font-bold text-sm">${d.data.info.name}</div>
            ${d.data.emp_count !== undefined ? `<div>${d.data.emp_count}</div>` : ''}
          </div>
        `;
      })
      .linkUpdate((d: any, i: number, arr: any) => {
        d3.select(arr[i])
          .attr('stroke', '#9ca3af')
          .attr('stroke-width', '2px');
      })
      .render();


    d3.select(this.chartContainer.nativeElement)
    .selectAll(".node")
    .on("mouseover", (event: MouseEvent, d: any) => {
      d3.select(event.currentTarget as HTMLElement)
        .select(".tooltip")
        .style("opacity", "1");
    })
    .on("mouseout", (event: MouseEvent, d: any) => {
      d3.select(event.currentTarget as HTMLElement)
        .select(".tooltip")
        .style("opacity", "0");
    });
  
  
    const svg = d3.select(this.chartContainer.nativeElement).select('svg');
    const g = svg.select('g');

    svg.style('cursor', 'grab');

    const zoom = d3.zoom()
      .on('start', () => svg.style('cursor', 'grabbing'))
      .on('zoom', (event: any) => {
        g.attr('transform', event.transform);
      })
      .on('end', () => svg.style('cursor', 'grab'));

    svg.call(zoom);
  }
}
