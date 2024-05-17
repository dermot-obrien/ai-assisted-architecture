package org.dobrien.ea.infrastructure;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.*;

public class ServicesExcel {

    private static Logger logger = LoggerFactory.getLogger(ServicesExcel.class);

    public static List<ServiceCategory> getServiceCategories(String servicesFilename,String nameMapFilename) {
        try {
            // Read service categories (originating from product catalogue).
            List<ServiceCategory> serviceCategories = new ArrayList<ServiceCategory>();
            FileInputStream fis = new FileInputStream(servicesFilename);
            XSSFWorkbook workbook = new XSSFWorkbook (fis);

            // Categories: ID Name Description	Link
            Sheet sheet = workbook.getSheet("Categories");
            Map<String,ServiceCategory> map = new HashMap<String,ServiceCategory>();
            int firstRowNo = sheet.getFirstRowNum();
            firstRowNo++;
            int lastRowNo = sheet.getLastRowNum();
            for (int rownum = firstRowNo; rownum <= lastRowNo; rownum++) {
                Row row = sheet.getRow(rownum);
                ServiceCategory serviceCategory = new ServiceCategory();
                int colnum = 1;
                serviceCategory.setName(row.getCell(colnum++).getStringCellValue());
                serviceCategory.setDescription(row.getCell(colnum++).getStringCellValue());
                serviceCategory.setLink(row.getCell(colnum++).getStringCellValue());
                serviceCategories.add(serviceCategory);
                map.put(serviceCategory.getName(),serviceCategory);
            }

            // Services:  ID	Name	Category	Description	Link	Preview
            sheet = workbook.getSheet("Services");
            firstRowNo = sheet.getFirstRowNum();
            firstRowNo++;
            lastRowNo = sheet.getLastRowNum();
            for (int rownum = firstRowNo; rownum <= lastRowNo; rownum++) {
                Row row = sheet.getRow(rownum);
                int colnum = 1;
                Service service = new Service();
                service.setName(row.getCell(colnum++).getStringCellValue());
                service.setCategory(row.getCell(colnum++).getStringCellValue());
                service.setDescription(row.getCell(colnum++).getStringCellValue());
                service.setLink(row.getCell(colnum++).getStringCellValue());
                service.setInPreview(row.getCell(colnum++).getBooleanCellValue());
                ServiceCategory serviceCategory = map.get(service.getCategory());
                serviceCategory.getServices().add(service);
            }

            workbook.close();
            fis.close();

            fis = new FileInputStream(nameMapFilename);
            workbook = new XSSFWorkbook(fis);
            sheet = workbook.getSheet("Categories");
            // Name	Title	Icon set
            firstRowNo = sheet.getFirstRowNum();
            firstRowNo++;
            lastRowNo = sheet.getLastRowNum();
            for (int rownum = firstRowNo; rownum <= lastRowNo; rownum++) {
                Row row = sheet.getRow(rownum);
                int colnum = 0;
                String name = row.getCell(colnum++).getStringCellValue();
                String title = row.getCell(colnum++).getStringCellValue();
                String iconSet = row.getCell(colnum++).getStringCellValue();
                ServiceCategory serviceCategory = map.get(name);
                if (serviceCategory == null) {
                    serviceCategory = new ServiceCategory();
                    serviceCategory.setName(name);
                    serviceCategory.setDescription("");
                    serviceCategory.setLink("");
                    map.put(serviceCategory.getName(),serviceCategory);
                    serviceCategories.add(serviceCategory);
                }
                serviceCategory.setIconSet(iconSet);
            }

            workbook.close();
            fis.close();
            return serviceCategories;
        }
        catch(Exception e) {
            logger.error("Unable to get service categories.", e);
        }
        return null;
    }

    public static void save(String filename, List<ServiceCategory> serviceCategories) {
        try {
            serviceCategories.sort(new Comparator<ServiceCategory>() {
                @Override
                public int compare(ServiceCategory o1, ServiceCategory o2) {
                    return o1.getName().compareTo(o2.getName());
                }
            });

            List<Service> services = new ArrayList<Service>();
            for (ServiceCategory serviceCategory : serviceCategories) {
                services.addAll(serviceCategory.getServices());
            }

            Workbook wb = new XSSFWorkbook();
            Sheet servicesSheet = wb.createSheet("Services");

            // Create header.
            int rownum = 0;
            Row row = servicesSheet.createRow(rownum++);
            int cellnum = 0;
            Cell cell = row.createCell(cellnum++);
            cell.setCellValue("ID");
            cell = row.createCell(cellnum++);
            cell.setCellValue("Name");
            cell = row.createCell(cellnum++);
            cell.setCellValue("Category");
            cell = row.createCell(cellnum++);
            cell.setCellValue("Description");
            cell = row.createCell(cellnum++);
            cell.setCellValue("Link");
            cell = row.createCell(cellnum++);
            cell.setCellValue("Preview");
            cell = row.createCell(cellnum++);
            cell.setCellValue("Icon Path");

            for (Service service : services) {
                row = servicesSheet.createRow(rownum++);
                cellnum = 0;
                cell = row.createCell(cellnum++);
                cell.setCellValue(service.getId());
                cell = row.createCell(cellnum++);
                cell.setCellValue(service.getName());
                cell = row.createCell(cellnum++);
                cell.setCellValue(service.getCategory());
                cell = row.createCell(cellnum++);
                cell.setCellValue(service.getDescription());
                cell = row.createCell(cellnum++);
                cell.setCellValue(service.getLink());
                cell = row.createCell(cellnum++);
                cell.setCellValue(service.isInPreview());
                cell = row.createCell(cellnum++);
                cell.setCellValue(service.getIconPath());
            }

            Sheet categoriesSheet = wb.createSheet("Categories");

            // Create header.
            rownum = 0;
            row = categoriesSheet.createRow(rownum++);
            cellnum = 0;
            cell = row.createCell(cellnum++);
            cell.setCellValue("ID");
            cell = row.createCell(cellnum++);
            cell.setCellValue("Name");
            cell = row.createCell(cellnum++);
            cell.setCellValue("Description");
            cell = row.createCell(cellnum++);
            cell.setCellValue("Link");

            for (ServiceCategory serviceCategory : serviceCategories) {
                row = categoriesSheet.createRow(rownum++);
                cellnum = 0;
                cell = row.createCell(cellnum++);
                cell.setCellValue(serviceCategory.getId());
                cell = row.createCell(cellnum++);
                cell.setCellValue(serviceCategory.getName());
                cell = row.createCell(cellnum++);
                cell.setCellValue(serviceCategory.getDescription());
                cell = row.createCell(cellnum++);
                cell.setCellValue(serviceCategory.getLink());
            }

            FileOutputStream fileOut = new FileOutputStream(filename);
            wb.write(fileOut);
            wb.close();
            fileOut.close();
        }
        catch(Exception e) {
            logger.error("Unable to save.",e);
        }
    }
}
