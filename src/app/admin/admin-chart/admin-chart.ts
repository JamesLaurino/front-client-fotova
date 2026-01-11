import {Component, effect, inject, input, InputSignal, ViewChild} from '@angular/core';
import {I18nService} from '../../service/i18n/i18nService';
import {OrderDetail} from '../../model/order/order-detail';
import {ChartConfiguration, ChartData, ChartType} from 'chart.js';
import {BaseChartDirective} from "ng2-charts";
import 'chart.js/auto';

@Component({
  selector: 'app-admin-chart',
  imports: [BaseChartDirective],
  templateUrl: './admin-chart.html',
  styleUrl: './admin-chart.css'
})
export class AdminChart {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  ordersDetailedInput: InputSignal<OrderDetail[] | undefined> = input.required<OrderDetail[] | undefined>();
  readonly i18n = inject(I18nService);

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: '#343030',
          font: {
            size: 13
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        min: 0,
        ticks: {
          color: '#343030',
          font: {
            size: 13
          },
          callback: function(value) { return `€${value}`; }
        },
        grid: {
          color: 'rgba(200, 179, 138, 0.2)'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#343030',
          font: {
            size: 14,
            weight: 600
          }
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 6,
        borderSkipped: false
      }
    }

  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Monthly Sales',
        backgroundColor: 'rgba(200, 179, 138, 0.8)',
        borderColor: 'rgba(200, 179, 138, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(200, 179, 138, 1)',
        hoverBorderColor: 'rgba(150, 130, 90, 1)'
      }
    ]
  };


  constructor() {
    effect(() => {
      const orders = this.ordersDetailedInput();
      if (orders) {
        this.processOrders(orders);
        this.chart?.update();
      }
    });
  }

  private processOrders(orders: OrderDetail[]) {
    const monthlySales = new Map<string, number>();
    orders.forEach(order => {
      const month = new Date(order.creationDate).toLocaleString('default', {month: 'long'});
      const currentSales = monthlySales.get(month) || 0;
      monthlySales.set(month, currentSales + order.total);
    });

    const sortedMonths = Array.from(monthlySales.keys()).sort((a, b) => {
        const aDate = new Date(`01 ${a} 2000`);
        const bDate = new Date(`01 ${b} 2000`);
        return aDate.getMonth() - bDate.getMonth();
    });

    this.barChartData.labels = sortedMonths;
    this.barChartData.datasets[0].data = sortedMonths.map(month => monthlySales.get(month) || 0);
  }
}
