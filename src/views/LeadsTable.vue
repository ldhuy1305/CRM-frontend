<template>
  <div class="leads-table">
    <table>
      <thead>
        <tr>
          <th>
            <input type="checkbox" v-model="allChecked" @change="toggleAllCheckboxes" />
          </th>
          <th v-for="key in fields" :key="key">
            {{ formatHeader(key) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lead in paginatedItems" :key="lead.email">
          <td>
            <input type="checkbox" v-model="lead.checked" @change="updateAllChecked" />
          </td>
          <td v-for="key in fields" :key="key">
            {{ formatValue(key, lead[key]) }}
          </td>
        </tr>
      </tbody>
    </table>

    
    <Pagination
      :rowsPerPage="rowsPerPage"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @update:rowsPerPage="(val) => { rowsPerPage = val }"
      @update:currentPage="(val) => { currentPage = val }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import LeadsFooter from './Pagination.vue'
import Pagination from './Pagination.vue'

interface Lead {
  name: string
  company: string
  email: string
  phone: string
  source: string
  owner: string
  checked: boolean
  gender: boolean
  date_of_birth?: Date
}

const fields: (keyof Omit<Lead, 'checked'>)[] = [
  'name',
  'company',
  'email',
  'phone',
  'source',
  'owner',
  'gender',
  'date_of_birth',
]

const items = ref<Lead[]>([
  {
    name: 'Le Tran Huong Giang',
    company: 'Unitech Dach',
    email: 'hgiang140302@gmail.com',
    phone: '0913283313',
    source: 'Zalo',
    owner: 'Sally Tran',
    checked: false,
    gender: false,
    date_of_birth: new Date('2002-03-14'),
  },
  {
    name: 'Tran Thanh Nhan',
    company: 'Abeam Consulting VietNam',
    email: 'thanhnhan@gmail.com',
    phone: '0987654321',
    source: 'Facebook',
    owner: 'Brown Tran',
    checked: false,
    gender: true,
    date_of_birth: new Date('2000-11-22'),
  },
  {
    name: 'Nguyen Thuc Nhi',
    company: 'TaiChung',
    email: 'ntnhi@gmail.com',
    phone: '0732648338',
    source: 'Website',
    owner: 'Brown Tran',
    checked: false,
    gender: false,
    date_of_birth: new Date('2001-01-29'),
  },
  {
    name: 'Le Duc Huy',
    company: 'Picon Technology',
    email: 'huyld@.com',
    phone: '0912345678',
    source: 'LinkedIn',
    owner: 'John Smith',
    checked: false,
    gender: true,
    date_of_birth: new Date('1998-07-10'),
  },
  {
    name: 'Pham Minh Tuan',
    company: 'TechVision Crop',
    email: 'tuanpm@techvision.com',
    phone: '0934567890',
    source: 'Twitter',
    owner: 'Sarah Wilson',
    checked: false,
    gender: true,
    date_of_birth: new Date('1995-09-05'),
  },
  {
    name: 'Nguyen Thi Mai Anh',
    company: 'Digital Solutions JSC',
    email: 'maianh.nguyen@digital.com',
    phone: '0978123456',
    source: 'Trade Show',
    owner: 'Mike Johnson',
    checked: false,
    gender: false,
    date_of_birth: new Date('1996-12-28'),
  },
  {
    name: 'Tran Van Minh',
    company: 'SmartTech Vietnam',
    email: 'mminhtr@smarttech.com',
    phone: '0912876543',
    source: 'Email Campaign',
    owner: 'Emily Davis',
    checked: false,
    gender: true,
    date_of_birth: new Date('1997-04-17'),
  },
  {
    name: 'Nguyen Khanh Quynh',
    company: 'Picon Vietnam',
    email: 'qunh1234@gmail.com',
    phone: '0905920623',
    source: 'Zalo',
    owner: 'Billy Nguyen',
    checked: false,
    gender: false,
    date_of_birth: new Date('2002-10-19'),
  },
  {
    name: 'Nguyen Thi Lien Phuong',
    company: 'Tailor Vietnam',
    email: 'phuong11@gmail.com',
    phone: '090592475',
    source: 'Website',
    owner: 'Billy Nguyen',
    checked: false,
    gender: false,
    date_of_birth: new Date('1971-12-11'),
  },
  {
    name: 'Nguyen Quynh Anh',
    company: 'Picon Vietnam',
    email: 'qanh30@gmail.com',
    phone: '0905920423',
    source: 'Twitter',
    owner: 'Billy Nguyen',
    checked: false,
    gender: false,
    date_of_birth: new Date('2005-09-30'),
  },
  {
    name: 'Nguyen Bui Nguyen Khoa',
    company: 'MB Bank',
    email: 'khoa29@gmail.com',
    phone: '0905920623',
    source: 'Facebook',
    owner: 'Billy Nguyen',
    checked: false,
    gender: true,
    date_of_birth: new Date('2001-04-29'),
  },
  {
    name: 'Tran Van Khoa',
    company: 'FPT Software',
    email: 'tran.khoa@fpt.com',
    phone: '0901234567',
    source: 'Facebook',
    owner: 'David Le',
    checked: false,
    gender: true,
    date_of_birth: new Date('1998-05-12'),
  },
  {
    name: 'Nguyen Thi Bich Dao',
    company: 'CMC Global',
    email: 'bichdao.nguyen@cmc.com',
    phone: '0912233445',
    source: 'Zalo',
    owner: 'Anna Nguyen',
    checked: false,
    gender: false,
    date_of_birth: new Date('2001-09-22'),
  },
  {
    name: 'Le Minh Tri',
    company: 'VNG Corporation',
    email: 'le.tri@vng.vn',
    phone: '0903344556',
    source: 'LinkedIn',
    owner: 'Tom Tran',
    checked: false,
    gender: true,
    date_of_birth: new Date('1997-12-03'),
  },
  {
    name: 'Pham Ngoc Han',
    company: 'TMA Solutions',
    email: 'phamhan@tmasolutions.vn',
    phone: '0925566778',
    source: 'Website',
    owner: 'Sara Pham',
    checked: false,
    gender: false,
    date_of_birth: new Date('1999-07-18'),
  },
  {
    name: 'Hoang Anh Tuan',
    company: 'KMS Technology',
    email: 'tuan.hoang@kms.com',
    phone: '0931122334',
    source: 'Email Campaign',
    owner: 'Chris Do',
    checked: false,
    gender: true,
    date_of_birth: new Date('2000-02-27'),
  },
  {
    name: 'Dang Thi My Linh',
    company: 'Haravan',
    email: 'linh.dang@haravan.com',
    phone: '0966677889',
    source: 'Trade Show',
    owner: 'Nancy Vo',
    checked: false,
    gender: false,
    date_of_birth: new Date('2002-11-09'),
  },
  {
    name: 'Vo Quoc Huy',
    company: 'Axon Active',
    email: 'vo.huy@axon.com',
    phone: '0977889900',
    source: 'Zalo',
    owner: 'John Pham',
    checked: false,
    gender: true,
    date_of_birth: new Date('1996-03-30'),
  },
  {
    name: 'Nguyen Mai Chau',
    company: 'SmartLog',
    email: 'mai.chau@smartlog.vn',
    phone: '0988776655',
    source: 'Facebook',
    owner: 'Lily Doan',
    checked: false,
    gender: false,
    date_of_birth: new Date('1995-10-01'),
  },
  {
    name: 'Bui Quang Hieu',
    company: 'Techcombank',
    email: 'quang.hieu@techcombank.com',
    phone: '0999988776',
    source: 'Twitter',
    owner: 'Peter Le',
    checked: false,
    gender: true,
    date_of_birth: new Date('1994-04-20'),
  },
  {
    name: 'Nguyen Minh Tu',
    company: 'Vietcombank',
    email: 'minh.tu@vietcombank.com',
    phone: '0998877665',
    source: 'Facebook',
    owner: 'Anna Tran',
    checked: false,
    gender: true,
    date_of_birth: new Date('1995-06-10'),
  },
  {
    name: 'Pham Thu Ha',
    company: 'VietinBank',
    email: 'thu.ha@vietinbank.com',
    phone: '0912345678',
    source: 'LinkedIn',
    owner: 'David Hoang',
    checked: false,
    gender: false,
    date_of_birth: new Date('1992-03-25'),
  },
  {
    name: 'Tran Bao Nam',
    company: 'Techcombank',
    email: 'bao.nam@techcombank.com',
    phone: '0987654321',
    source: 'Instagram',
    owner: 'Peter Le',
    checked: false,
    gender: true,
    date_of_birth: new Date('1991-07-15'),
  },
  {
    name: 'Le Thi Lan',
    company: 'Sacombank',
    email: 'thi.lan@sacombank.com',
    phone: '0901122334',
    source: 'Twitter',
    owner: 'Anna Tran',
    checked: false,
    gender: false,
    date_of_birth: new Date('1993-11-12'),
  },
  {
    name: 'Nguyen Quoc Toan',
    company: 'MB Bank',
    email: 'quoc.toan@mbbank.com',
    phone: '0922334455',
    source: 'Facebook',
    owner: 'David Hoang',
    checked: false,
    gender: true,
    date_of_birth: new Date('1988-05-05'),
  },
  {
    name: 'Phan Hoang Anh',
    company: 'Techcombank',
    email: 'hoang.anh@techcombank.com',
    phone: '0933445566',
    source: 'Instagram',
    owner: 'Peter Le',
    checked: false,
    gender: true,
    date_of_birth: new Date('1990-12-01'),
  },
  {
    name: 'Nguyen Tuan Anh',
    company: 'Vietcombank',
    email: 'tuan.anh@vietcombank.com',
    phone: '0909876543',
    source: 'Twitter',
    owner: 'Anna Tran',
    checked: false,
    gender: true,
    date_of_birth: new Date('1987-09-30'),
  },
  {
    name: 'Le Bao Hoa',
    company: 'VietinBank',
    email: 'bao.hoa@vietinbank.com',
    phone: '0912789456',
    source: 'LinkedIn',
    owner: 'David Hoang',
    checked: false,
    gender: false,
    date_of_birth: new Date('1992-02-14'),
  },
  {
    name: 'Pham Minh Thao',
    company: 'Sacombank',
    email: 'minh.thao@sacombank.com',
    phone: '0945678901',
    source: 'Instagram',
    owner: 'Peter Le',
    checked: false,
    gender: false,
    date_of_birth: new Date('1993-08-09'),
  },
  {
    name: 'Tran Thi Lan Anh',
    company: 'MB Bank',
    email: 'thi.lan.anh@mbbank.com',
    phone: '0913579246',
    source: 'Facebook',
    owner: 'Anna Tran',
    checked: false,
    gender: false,
    date_of_birth: new Date('1994-06-20'),
  },
  {
    name: 'Le Hoang Son',
    company: 'Vietcombank',
    email: 'hoang.son@vietcombank.com',
    phone: '0976432101',
    source: 'Twitter',
    owner: 'David Hoang',
    checked: false,
    gender: true,
    date_of_birth: new Date('1990-01-05'),
  },
  {
    name: 'Nguyen Mai Anh',
    company: 'Techcombank',
    email: 'mai.anh@techcombank.com',
    phone: '0987665443',
    source: 'LinkedIn',
    owner: 'Peter Le',
    checked: false,
    gender: false,
    date_of_birth: new Date('1993-07-13'),
  },
  {
    name: 'Pham Thi Bao',
    company: 'VietinBank',
    email: 'thi.bao@vietinbank.com',
    phone: '0912345679',
    source: 'Facebook',
    owner: 'Anna Tran',
    checked: false,
    gender: false,
    date_of_birth: new Date('1995-11-29'),
  },
  {
    name: 'Trinh Minh Tiến',
    company: 'Sacombank',
    email: 'minh.tien@sacombank.com',
    phone: '0906543210',
    source: 'Instagram',
    owner: 'David Hoang',
    checked: false,
    gender: true,
    date_of_birth: new Date('1988-10-22'),
  },
  {
    name: 'Nguyen Bich Thu',
    company: 'MB Bank',
    email: 'bich.thu@mbbank.com',
    phone: '0912346789',
    source: 'Twitter',
    owner: 'Peter Le',
    checked: false,
    gender: false,
    date_of_birth: new Date('1992-04-14'),
  },
  {
    name: 'Tran Minh Quang',
    company: 'Vietcombank',
    email: 'minh.quang@vietcombank.com',
    phone: '0988887766',
    source: 'LinkedIn',
    owner: 'Anna Tran',
    checked: false,
    gender: true,
    date_of_birth: new Date('1991-02-16'),
  },
  {
    name: 'Phan Thi Hoai',
    company: 'Techcombank',
    email: 'thi.hoai@techcombank.com',
    phone: '0922335777',
    source: 'Facebook',
    owner: 'David Hoang',
    checked: false,
    gender: false,
    date_of_birth: new Date('1993-12-05'),
  },
  {
    name: 'Nguyen Thi Mai',
    company: 'VietinBank',
    email: 'thi.mai@vietinbank.com',
    phone: '0933448899',
    source: 'Twitter',
    owner: 'Peter Le',
    checked: false,
    gender: false,
    date_of_birth: new Date('1995-08-01'),
  },
  {
    name: 'Pham Hoang Vu',
    company: 'Sacombank',
    email: 'hoang.vu@sacombank.com',
    phone: '0912563789',
    source: 'LinkedIn',
    owner: 'Anna Tran',
    checked: false,
    gender: true,
    date_of_birth: new Date('1990-11-14'),
  },
  {
    name: 'Tran Thi Lan',
    company: 'MB Bank',
    email: 'thi.lan@mbbank.com',
    phone: '0923445678',
    source: 'Instagram',
    owner: 'David Hoang',
    checked: false,
    gender: false,
    date_of_birth: new Date('1992-07-23'),
  },
  {
    name: 'Nguyen Thi Mai',
    company: 'Vietcombank',
    email: 'mai.nguyen@vietcombank.com',
    phone: '0905678912',
    source: 'Facebook',
    owner: 'Peter Le',
    checked: false,
    gender: false,
    date_of_birth: new Date('1990-04-12'),
  },
  {
    name: 'Tran Minh Hoang',
    company: 'VietinBank',
    email: 'hoang.tran@vietinbank.com',
    phone: '0912345876',
    source: 'LinkedIn',
    owner: 'Anna Tran',
    checked: false,
    gender: true,
    date_of_birth: new Date('1992-08-10'),
  },
  {
    name: 'Le Thi Kim',
    company: 'Techcombank',
    email: 'kim.le@techcombank.com',
    phone: '0922233445',
    source: 'Instagram',
    owner: 'David Hoang',
    checked: false,
    gender: false,
    date_of_birth: new Date('1989-11-05'),
  },
  {
    name: 'Nguyen Quoc Tu',
    company: 'Sacombank',
    email: 'tu.nguyen@sacombank.com',
    phone: '0932345567',
    source: 'Facebook',
    owner: 'Peter Le',
    checked: false,
    gender: true,
    date_of_birth: new Date('1991-02-14'),
  },
  {
    name: 'Pham Thu Dao',
    company: 'Vietcombank',
    email: 'dao.pham@vietcombank.com',
    phone: '0902545678',
    source: 'LinkedIn',
    owner: 'Anna Tran',
    checked: false,
    gender: false,
    date_of_birth: new Date('1994-01-23'),
  },
  {
    name: 'Trinh Minh Tuan',
    company: 'VietinBank',
    email: 'tuan.trinh@vietinbank.com',
    phone: '0914567890',
    source: 'Twitter',
    owner: 'David Hoang',
    checked: false,
    gender: true,
    date_of_birth: new Date('1985-07-30'),
  },
  {
    name: 'Nguyen Thi Lan',
    company: 'MB Bank',
    email: 'lan.nguyen@mbbank.com',
    phone: '0923456789',
    source: 'Instagram',
    owner: 'Peter Le',
    checked: false,
    gender: false,
    date_of_birth: new Date('1993-09-17'),
  },
  {
    name: 'Tran Thi Huong',
    company: 'Sacombank',
    email: 'huong.tran@sacombank.com',
    phone: '0913345567',
    source: 'Facebook',
    owner: 'Anna Tran',
    checked: false,
    gender: false,
    date_of_birth: new Date('1992-05-11'),
  },
  {
    name: 'Pham Quang Son',
    company: 'Vietcombank',
    email: 'son.pham@vietcombank.com',
    phone: '0901234567',
    source: 'LinkedIn',
    owner: 'David Hoang',
    checked: false,
    gender: true,
    date_of_birth: new Date('1990-06-02'),
  },
  {
    name: 'Le Thi Dao',
    company: 'Techcombank',
    email: 'dao.le@techcombank.com',
    phone: '0912345678',
    source: 'Instagram',
    owner: 'Peter Le',
    checked: false,
    gender: false,
    date_of_birth: new Date('1994-03-15'),
  },
  {
    name: 'Nguyen Bao Hoa',
    company: 'VietinBank',
    email: 'hoa.nguyen@vietinbank.com',
    phone: '0922334455',
    source: 'Twitter',
    owner: 'Anna Tran',
    checked: false,
    gender: false,
    date_of_birth: new Date('1988-11-20'),
  },
  {
    name: 'Pham Quoc Anh',
    company: 'Sacombank',
    email: 'anh.pham@sacombank.com',
    phone: '0945678901',
    source: 'Facebook',
    owner: 'David Hoang',
    checked: false,
    gender: true,
    date_of_birth: new Date('1995-04-12'),
  },
  {
    name: 'Trinh Thi Minh',
    company: 'MB Bank',
    email: 'minh.trinh@mbbank.com',
    phone: '0922337788',
    source: 'LinkedIn',
    owner: 'Peter Le',
    checked: false,
    gender: false,
    date_of_birth: new Date('1991-05-19'),
  },
  {
    name: 'Nguyen Bich Hoa',
    company: 'Techcombank',
    email: 'hoa.nguyen@techcombank.com',
    phone: '0905555555',
    source: 'Instagram',
    owner: 'David Hoang',
    checked: false,
    gender: false,
    date_of_birth: new Date('1993-02-01'),
  },
  {
    name: 'Pham Thanh Son',
    company: 'Vietcombank',
    email: 'son.pham@vietcombank.com',
    phone: '0909876543',
    source: 'Facebook',
    owner: 'Anna Tran',
    checked: false,
    gender: true,
    date_of_birth: new Date('1991-10-18'),
  },
  {
    name: 'Trinh Thi Lieu',
    company: 'VietinBank',
    email: 'lieu.trinh@vietinbank.com',
    phone: '0912345678',
    source: 'LinkedIn',
    owner: 'Peter Le',
    checked: false,
    gender: false,
    date_of_birth: new Date('1989-06-09'),
  },
  {
    name: 'Nguyen Minh Hoang',
    company: 'Sacombank',
    email: 'hoang.nguyen@sacombank.com',
    phone: '0933445566',
    source: 'Instagram',
    owner: 'David Hoang',
    checked: false,
    gender: true,
    date_of_birth: new Date('1990-01-04'),
  },
  {
    name: 'Le Thi Bao',
    company: 'Techcombank',
    email: 'bao.le@techcombank.com',
    phone: '0912345678',
    source: 'LinkedIn',
    owner: 'Peter Le',
    checked: false,
    gender: false,
    date_of_birth: new Date('1992-08-20'),
  },
  {
    name: 'Nguyen Thi Mai',
    company: 'VietinBank',
    email: 'mai.nguyen@vietinbank.com',
    phone: '0922334466',
    source: 'Twitter',
    owner: 'Anna Tran',
    checked: false,
    gender: false,
    date_of_birth: new Date('1987-07-11'),
  },
  {
    name: 'Pham Bao Quyen',
    company: 'Sacombank',
    email: 'quyen.pham@sacombank.com',
    phone: '0908765432',
    source: 'Facebook',
    owner: 'Peter Le',
    checked: false,
    gender: false,
    date_of_birth: new Date('1995-09-24'),
  },
  {
    name: 'Trinh Minh Hoa',
    company: 'Vietcombank',
    email: 'hoa.trinh@vietcombank.com',
    phone: '0933445566',
    source: 'LinkedIn',
    owner: 'David Hoang',
    checked: false,
    gender: false,
    date_of_birth: new Date('1993-05-10'),
  },
  {
    name: 'Nguyen Thi Lan Anh',
    company: 'MB Bank',
    email: 'lan.anh.nguyen@mbbank.com',
    phone: '0922334455',
    source: 'Instagram',
    owner: 'Peter Le',
    checked: false,
    gender: false,
    date_of_birth: new Date('1991-11-12'),
  },
  {
    name: 'Pham Bao Hieu',
    company: 'VietinBank',
    email: 'hieu.pham@vietinbank.com',
    phone: '0912345689',
    source: 'LinkedIn',
    owner: 'David Hoang',
    checked: false,
    gender: true,
    date_of_birth: new Date('1994-10-16'),
  },
  {
    name: 'Trinh Thi Kim',
    company: 'Sacombank',
    email: 'kim.trinh@sacombank.com',
    phone: '0922334455',
    source: 'Instagram',
    owner: 'Anna Tran',
    checked: false,
    gender: false,
    date_of_birth: new Date('1995-07-20'),
  },
  {
    name: 'Nguyen Minh Duong',
    company: 'Techcombank',
    email: 'duong.nguyen@techcombank.com',
    phone: '0912233445',
    source: 'Facebook',
    owner: 'Peter Le',
    checked: false,
    gender: true,
    date_of_birth: new Date('1990-12-02'),
  },
  {
    name: 'Pham Thi Tuan',
    company: 'Vietcombank',
    email: 'tuan.pham@vietcombank.com',
    phone: '0945678901',
    source: 'LinkedIn',
    owner: 'Anna Tran',
    checked: false,
    gender: false,
    date_of_birth: new Date('1991-05-28'),
  },
  {
    name: 'Trinh Bao Son',
    company: 'VietinBank',
    email: 'son.trinh@vietinbank.com',
    phone: '0932345678',
    source: 'Facebook',
    owner: 'David Hoang',
    checked: false,
    gender: true,
    date_of_birth: new Date('1993-02-17'),
  },
  {
    name: 'Nguyen Thi Mai',
    company: 'Techcombank',
    email: 'mai.nguyen@techcombank.com',
    phone: '0912345678',
    source: 'Instagram',
    owner: 'Peter Le',
    checked: false,
    gender: false,
    date_of_birth: new Date('1989-03-12'),
  },
  {
    name: 'Pham Minh Hoa',
    company: 'Sacombank',
    email: 'hoa.pham@sacombank.com',
    phone: '0908765432',
    source: 'Facebook',
    owner: 'David Hoang',
    checked: false,
    gender: false,
    date_of_birth: new Date('1994-08-10'),
  },
  {
    name: 'Trinh Thi Lan Anh',
    company: 'Vietcombank',
    email: 'lan.anh.trinh@vietcombank.com',
    phone: '0922334455',
    source: 'LinkedIn',
    owner: 'Peter Le',
    checked: false,
    gender: false,
    date_of_birth: new Date('1991-06-04'),
  },
  {
    name: 'Nguyen Thi Bao',
    company: 'VietinBank',
    email: 'bao.nguyen@vietinbank.com',
    phone: '0912345679',
    source: 'Instagram',
    owner: 'David Hoang',
    checked: false,
    gender: false,
    date_of_birth: new Date('1988-12-17'),
  },
])

const rowsPerPage = ref(10)
const currentPage = ref(1)
const totalPages = computed(() =>
  Math.ceil(items.value.length / rowsPerPage.value)
)

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  const end = start + rowsPerPage.value
  return items.value.slice(start, end)
})

const allChecked = ref(false)

function toggleAllCheckboxes() {
  items.value.forEach((lead) => (lead.checked = allChecked.value))
}

function updateAllChecked() {
  allChecked.value = items.value.every((lead) => lead.checked)
}

function formatHeader(key: string): string {
  const formatted = key.replace(/_/g, ' ').toLowerCase()
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

function formatDate(date: Date): string {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

function formatValue(key: keyof Lead, value: any): string {
  if (key === 'gender') return value ? 'Nam' : 'Nữ'
  if (key === 'date_of_birth') return value instanceof Date ? formatDate(value) : ''
  return String(value)
}
</script>

<style scoped>
.leads-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fc;
  font-weight: 500;
  color: #1a3353;
}
</style>
