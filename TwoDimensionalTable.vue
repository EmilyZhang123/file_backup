<template>
    <div class="two-dimensional-table">
      <div class="title-box">
        <div style="flex: 1">{{fileddata.showName}}</div>
        <div style="flex: 2;text-align: right">
          <el-button type="primary" icon="el-icon-search" @click="searchDialog = true">查询</el-button>
          <el-button type="primary" icon="el-icon-data-line" @click="countDialog = true">统计</el-button>
          <el-button type="primary" icon="el-icon-plus" >新建</el-button>
          <el-button type="primary" icon="el-icon-delete">删除</el-button>
        </div>
      </div>
      <div style="padding-top: 10px;height: calc(100vh - 200px);" v-show = "!countShow">
        <el-table :data="tableList" stripe
                  max-height="calc(100% - 50px)"
                  @selection-change = "tableSelectChange"
                  @sort-change="tableSort"
                  :header-cell-style="{background:'#E4EAF1',color:'#606266'}">>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="ID" prop="id"></el-table-column>
          <el-table-column label="行政区名称" prop="regionName"
                           :filters="[{text: '2016-05-01', value: '2016-05-01'}, {text: '2016-05-02', value: '2016-05-02'}, {text: '2016-05-03', value: '2016-05-03'}, {text: '2016-05-04', value: '2016-05-04'}]"
                           :filter-method="filterHandler">
          </el-table-column>
          <el-table-column label="行政区编码" prop="regionCode" sortable="custom"></el-table-column>
          <el-table-column label="辖区面积" prop="regionArea" ></el-table-column>
          <el-table-column label="描述" prop="desc" ></el-table-column>
          <el-table-column label="操作"  >
            <template slot-scope="scope">
              <i class="icon-button el-icon-edit" @click="edit"></i>
              <i class="icon-button el-icon-delete" @click="delete_"></i>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-pagination background
                         layout="total,prev, pager, next"
                         :total="total"
                         style="text-align:center;"
                         :current-page="currentPage"
                         :page-size="pageSize"
                         @current-change="handlePage">
          </el-pagination>
        </div>
      </div>
      <div v-show="countShow" >
        <div style="text-align: right;padding: 10px 0">
          <span v-for="(item,index) in countTypeList" :key="Math.random()"
                :class="['count-show-type',{'type-active':countShowType === item.val}]"
                @click="changeCountStyle(item.val)">
            {{item.label}}
          </span>
        </div>
        <div style="width: 100%;height: calc(100vh - 300px);" id="chart-box"></div>
      </div>
      <el-dialog title="查询规则" :visible.sync="searchDialog" width="420px" :close-on-click-modal="false" >
        <el-form :model="searchForm" ref="searchFrom" label-width="138px">
          <el-form-item label="面积查询条件" prop="areaCondition">
            <el-select v-model="searchForm.areaCondition" size="medium" clearable s>
              <el-option v-for="item in JSON.parse(JSON.stringify(conditionList))" :key="Math.random()" :label="item.text" :value="item.val" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="searchForm.areaCondition != ''"
                        prop="areaVal"
                        :rules="[
                          {required: true, message: '面积值不能为空', trigger: 'blur' },
                          {type:'number', message: '面积值必须为数字' },
                          ]">
            <span slot="label"></span>
            <el-input v-model="searchForm.areaVal" placeholder="请输入面积值" style="width: 221px;"></el-input>
          </el-form-item>
          <el-form-item label="行政区名称查询条件" prop="nameCondition">
            <el-select v-model="searchForm.nameCondition" size="medium" clearable>
              <el-option v-for="item in JSON.parse(JSON.stringify(conditionList))" :key="Math.random()" :label="item.text" :value="item.val"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="searchForm.nameCondition != ''"
                        prop="codeVal"
                        :rules="{required: true, message: '值不能为空', trigger: 'blur' }">
            <span slot="label"></span>
            <el-input v-model="searchForm.codeVal" placeholder="请输入值" style="width: 221px;"></el-input>
          </el-form-item>
          <el-form-item label="行政区代码查询条件" prop="codeCondition">
            <el-select v-model="searchForm.codeCondition" size="medium" clearable>
              <el-option v-for="item in JSON.parse(JSON.stringify(conditionList))" :key="Math.random()" :label="item.text" :value="item.val"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="searchForm.codeCondition != ''"
                        prop="nameVal"
                        :rules="{required: true, message: '值不能为空', trigger: 'blur' }">
            <span slot="label"></span>
            <el-input v-model="searchForm.nameVal" placeholder="请输入值" style="width: 221px;"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <el-button @click="searchConfirm(false)">取消</el-button>
          <el-button type="primary" @click="searchConfirm(true)">确认</el-button>
        </div>
      </el-dialog>
      <el-dialog title="统计规则" :visible.sync="countDialog" width="420px" :close-on-click-modal="false" >
        <el-form :model="searchForm" ref="searchFrom" label-width="100px">
          <el-form-item label="行维字段" prop="areaCondition">
            <el-select v-model="searchForm.areaCondition" size="medium" clearable s>
              <el-option v-for="item in JSON.parse(JSON.stringify(conditionList))" :key="Math.random()" :label="item.text" :value="item.val" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="searchForm.areaCondition !== ''"
                        prop="areaVal"
                        :rules="[
                          {required: true, message: '面积值不能为空', trigger: 'blur' },
                          {type:'number', message: '面积值必须为数字' },
                          ]">
            <span slot="label"></span>
            <el-input v-model="searchForm.areaVal" placeholder="请输入面积值" style="width: 221px;"></el-input>
          </el-form-item>
          <el-form-item label="列维字段" prop="nameCondition">
            <el-select v-model="searchForm.nameCondition" size="medium" clearable>
              <el-option v-for="item in JSON.parse(JSON.stringify(conditionList))" :key="Math.random()" :label="item.text" :value="item.val"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="searchForm.nameCondition !== ''"
                        prop="codeVal"
                        :rules="{required: true, message: '值不能为空', trigger: 'blur' }">
            <span slot="label"></span>
            <el-input v-model="searchForm.codeVal" placeholder="请输入值" style="width: 221px;"/>
          </el-form-item>
          <el-form-item label="指标值" prop="codeCondition">
            <el-select v-model="searchForm.codeCondition" size="medium" clearable>
              <el-option v-for="item in JSON.parse(JSON.stringify(conditionList))" :key="Math.random()" :label="item.text" :value="item.val"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="searchForm.codeCondition !== ''"
                        prop="nameVal"
                        :rules="{required: true, message: '值不能为空', trigger: 'blur' }">
            <span slot="label"></span>
            <el-input v-model="searchForm.nameVal" placeholder="请输入值" style="width: 221px;"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <el-button @click="countConfirm(false)">取消</el-button>
          <el-button type="primary" @click="countConfirm(true)">确认</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    name: 'TwoDimensionalTable',
    data(){
      return {
        countTypeList:[
          {label:'柱状图',val:'bar'},
          {label:'折线图',val:'line'},
          {label:'统计表',val:'table'},
        ],
        countShow:false,
        countShowType:'bar',
        tableList:[
          {id:0,regionName:'武汉市',regionCode:'422100',regionArea:10000,desc:'555'},
          {id:1,regionName:'武汉市',regionCode:'422120',regionArea:10000,desc:'555'},
        ],
        currentPage:1,
        pageSize:10,
        total:20,
        searchForm:{
          areaCondition:'',
          areaVal:'',
          codeCondition:'',
          codeVal:'',
          nameCondition:'',
          nameVal:'',
        },
        tableSelection:[],
        searchDialog:false,
        conditionList:[
          {text:'等于',val:'1'},
          {text:'不等于',val:'3'},
          {text:'为空',val:'4'},
          {text:'不为空',val:'r'},
          {text:'包含',val:'f'},
          {text:'不等于',val:'ff'},
          {text:'开始于',val:'vv'},
          {text:'结束于',val:'asdf'},
        ],
        countDialog:false
      }
    },
    props:['fileddata'],
    mounted() {
      this.$nextTick(()=>{

      })
    },
    methods:{
     //搜索确认或取消事件 flag [Boolean] 确认或取消按钮的标记
      searchConfirm(flag){
        if (flag){
          //确定
          let isValid = true;
          this.$refs.searchFrom.validate((valid) => {
            if (!valid) {
              isValid = false;
              return false
            }
          });
          if (!isValid) {return false}
          this.searchDialog = false;
          this.countShow = false;
        } else {
          //取消
          this.$refs.searchFrom.clearValidate()
          this.searchDialog = false;
        }
      },
      // 分页页码改变函数 val [Number] 改变后的页码数
      handlePage(val){
        this.currentPage = val
      },
      //编辑函数
      edit(){
        alert('edit')
      },
      //删除函数
      delete_(){
        alert('delete_')
      },
      //表格排序函数
      tableSort(column, prop, order ){
        console.log(column)
        console.log(order)
      },
      //表格过滤函数
      filterHandler(){

      },
      //表格筛选改变 selection [Array] 表格选中的行数据
      tableSelectChange(selection){
        this.tableSelection = [...selection];
      },
      //统计条件确认或取消 flag [Boolean] 确认或取消标记
      countConfirm(flag){
        if (flag){
          this.countDialog = false;
          this.countShow = true;
          this.$nextTick(()=>{
            this.changeCountStyle(this.countShowType)
          })
        }else {
          this.countDialog = false
        }
      },
      //改变统计样式 type [String] bar柱状图，line折线图，table统计表
      changeCountStyle(type){
        this.countShowType = type;
        let myChart = echarts.init(document.getElementById('chart-box'));
        let option = {};
        if (type === 'bar') {
          option = this.barChartOption()
        } else if (type === 'line') {
          option = this.lineChartOption()
        }
        myChart.setOption(option,true)
      },
      //折线图配置
      lineChartOption(){
        return {
          grid: { left: '20', right: '20', bottom: '20',top:'20', containLabel: true },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#333333'
              }
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisLabel:{textStyle:{color:'#333333'}},
            axisLine:{lineStyle:{color:'#bbbbbb'}},
          },
          yAxis: {
            type: 'value',
            axisLine:{show:false},
            axisTick:{ show:false, },
            splitLine:{lineStyle:{type:'dashed'}}
          },
          series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            lineStyle:{color:'#3398DB'},
            itemStyle:{color:'#3398DB'}
          }]
        }
      },
      //柱状图配置
      barChartOption(){
        return {
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: { left: '20', right: '20', bottom: '20',top:'20', containLabel: true },
          xAxis: [
            {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              axisLabel:{textStyle:{color:'#333333'}},
              axisLine:{lineStyle:{color:'#bbbbbb'}},
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLine:{show:false},
              axisTick:{ show:false, },
              splitLine:{lineStyle:{type:'dashed'}}
            }
          ],
          series: [
            { name: '直接访问', type: 'bar', barWidth: '60%', data: [10, 52, 200, 334, 390, 330, 220] }
          ]
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .two-dimensional-table {
    padding: 10px 20px;
  }
  .title-box {
    display: flex;
    align-items: center;
  }
  .count-show-type {
    display: inline-block;
    border: 1px solid #4b94ff;
    padding: 10px;
    color:#4b94ff;
    cursor: pointer;
  }
  .count-show-type + .count-show-type {
    border-left-width: 0;
  }
  .type-active {
    background: #4b94ff;
    color: #FFFFFF;
    cursor: default;
  }
  /deep/.el-form-item__label{
    /*width: 138px;*/
    font-weight: bold;
  }
</style>
