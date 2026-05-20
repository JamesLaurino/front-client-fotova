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
          color: '#868e96',
          font: { size: 12 }
        },
        grid: {
          display: false
        }
      },
      y: {
        min: 0,
        ticks: {
          color: '#868e96',
          font: { size: 12 },
          callback: function(value) { return `€${value}`; }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.06)'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#343030',
          font: { size: 13, weight: 600 },
          boxWidth: 12,
          borderRadius: 4
        }
      },
      tooltip: {
        backgroundColor: '#343030',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return ` €${(context.parsed.y as number).toFixed(2)}`;
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
        label: '',
        backgroundColor: 'rgba(52, 48, 48, 0.8)',
        borderColor: 'rgba(52, 48, 48, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(52, 48, 48, 1)',
        hoverBorderColor: 'rgba(52, 48, 48, 1)'
      }
    ]
  };

  constructor() {
    effect(() => {
      const orders = this.ordersDetailedInput();
      this.barChartData.datasets[0].label = this.i18n.getTranslation('MONTHLY_SALES');
      if (orders) {
        this.processOrders(orders);
      }
      this.chart?.update();
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
