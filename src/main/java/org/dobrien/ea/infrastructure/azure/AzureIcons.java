package org.dobrien.ea.infrastructure.azure;

import org.apache.poi.sl.usermodel.Insets2D;
import org.apache.poi.sl.usermodel.PictureData;
import org.apache.poi.sl.usermodel.VerticalAlignment;
import org.apache.poi.util.IOUtils;
import org.apache.poi.xslf.usermodel.*;
import org.dobrien.ea.infrastructure.Icon;
import org.dobrien.ea.infrastructure.Service;
import org.dobrien.ea.infrastructure.ServiceCategory;
import org.dobrien.ea.infrastructure.ServicesExcel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.awt.*;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.*;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

public class AzureIcons {

    private static Logger logger = LoggerFactory.getLogger(AzureIcons.class);

    public static void createPowerpoint(String filename,String template,List<ServiceCategory> serviceCategories) {
        try {
            // creating a presentation
            FileInputStream templateStream = new FileInputStream(template);
            XMLSlideShow ppt = new XMLSlideShow(templateStream);

            //getting the slide master object
            XSLFSlideMaster slideMaster = ppt.getSlideMasters().get(0);

            //get the desired slide layout
            XSLFSlideLayout titleLayout = slideMaster.getLayout("Title");
            java.awt.Dimension pgsize = ppt.getPageSize();

            int xTableOffset = 60;
            int yTableOffset = 70;
            int tableRowHeight = 100;
            serviceCategories.sort(new Comparator<ServiceCategory>() {
                @Override
                public int compare(ServiceCategory o1, ServiceCategory o2) {
                    return o1.getName().compareTo(o2.getName());
                }
            });
            for (ServiceCategory serviceCategory : serviceCategories) {

                int tableHeight = 0;

                List<Service> services = serviceCategory.getServices();
                if (services.size() > 0) {
                    services.sort(new Comparator<Service>() {
                        @Override
                        public int compare(Service o1, Service o2) {
                            return o1.getName().compareTo(o2.getName());
                        }
                    });

                    // creating a slide in it
                    XSLFSlide slide = ppt.createSlide(titleLayout);

                    // selecting the place holder in it
                    XSLFTextShape title = slide.getPlaceholder(0);

                    // setting the title init
                    title.setText(serviceCategory.getName()+" - Services");

                    int index = 0;
                    int serviceColumns = 8;
                    int serviceRows = (int) Math.ceil((double)services.size() / (double)serviceColumns);
                    int tableColumnWidth = (pgsize.width - xTableOffset) / serviceColumns;
                    XSLFTable tbl = slide.createTable();
                    tableHeight = tableRowHeight * serviceRows;
                    tbl.setAnchor(new Rectangle(xTableOffset, yTableOffset, tableColumnWidth * serviceColumns, tableHeight));
                    for (int rownum = 0; rownum < serviceRows; rownum++) {
                        XSLFTableRow tr = tbl.addRow();
                        tr.setHeight(tableRowHeight);

                        for (int i = 0; i < serviceColumns; i++) {
                            if (index < services.size()) {
                                Service service = services.get(index);
                                XSLFTableCell cell = tr.addCell();
                                XSLFTextParagraph p = cell.addNewTextParagraph();
                                XSLFTextRun r = p.addNewTextRun();
                                r.setText(service.getName() + ". ");
                                r.setBold(true);
                                r.setFontSize(10.);
                                r = p.addNewTextRun();
                                r.setText(service.getDescription());
                                r.setBold(false);
                                r.setFontSize(10.);
                            }
                            else {
                                XSLFTableCell cell = tr.addCell();
                                XSLFTextParagraph p = cell.addNewTextParagraph();
                                XSLFTextRun r = p.addNewTextRun();
                                r.setText("");
                            }
                            index ++;
                        }
                    }
                }

                List<Icon> icons = serviceCategory.getIcons();
                if (icons.size() > 0) {
                    icons.sort(new Comparator<Icon>() {
                        @Override
                        public int compare(Icon o1, Icon o2) {
                            return o1.getName().compareTo(o2.getName());
                        }
                    });
                    // creating a slide in it
                    XSLFSlide slide = ppt.createSlide(titleLayout);

                    // selecting the place holder in it
                    XSLFTextShape title = slide.getPlaceholder(0);

                    // setting the title init
                    title.setText(serviceCategory.getName()+" - Icons");

                    int xOffset = 60;
                    int yOffset = 70;
                    int yLowerMargin = 50;
                    int x = xOffset;
                    int y = yOffset;
                    int iconWidth = 30;
                    int iconHeight = 30;
                    int nameWidth = 100;
                    int nameHeight = 30;
                    int cellWidth = nameWidth;
                    int cellHeight = iconHeight + nameHeight;
                    int xMargin = 10;
                    int yMargin = 10;
                    int nCols = (pgsize.width - xOffset) / (cellWidth + xMargin);
                    int nRows = (pgsize.height - yOffset - yLowerMargin) / (cellHeight + yMargin);
                    int perPage = nRows * nCols;
                    int colNo = 0;
                    int index = 0;
                    for (Icon icon : icons) {
                        if (index >= perPage) {
                            // creating a slide in it
                            slide = ppt.createSlide(titleLayout);
                            // selecting the place holder in it
                            title = slide.getPlaceholder(0);

                            // setting the title init
                            title.setText(serviceCategory.getName() + " - Icons (continued)");
                            y = yOffset;
                            x = xOffset;
                            colNo = 0;
                            index = 0;
                        }
                        File image = new File(icon.getIconPath());
                        byte[] imageBytes = IOUtils.toByteArray(new FileInputStream(image));
                        XSLFPictureData idx = ppt.addPicture(imageBytes, PictureData.PictureType.SVG);
                        XSLFPictureShape picture = slide.createPicture(idx);
                        picture.setAnchor(new Rectangle(x, y, iconWidth, iconHeight));

                        XSLFTextBox nameShape = slide.createTextBox();
                        XSLFTextRun r = nameShape.appendText(icon.getName(), false);
                        r.setFontColor(Color.black);
                        r.setFontSize(10.);
                        nameShape.setInsets(new Insets2D(0, 0, 0, 0));
                        nameShape.setWordWrap(true);
                        nameShape.setHorizontalCentered(true);
                        nameShape.setVerticalAlignment(VerticalAlignment.TOP);
                        nameShape.setAnchor(new Rectangle(x - (nameWidth - iconWidth) / 2, y + iconHeight, nameWidth, nameHeight));

                        x += cellWidth + xMargin;
                        if (++colNo >= nCols) {
                            y += cellHeight + yMargin;
                            x = xOffset;
                            colNo = 0;
                        }
                        index++;
                    }
                }
            }

            // creating a file object
            File file = new File(filename);
            FileOutputStream out = new FileOutputStream(file);

            //saving the changes to a file
            ppt.write(out);
            out.close();
        }
        catch(Exception e) {
            logger.error("Unable to create.",e);
        }
    }

    public List<ServiceCategory> extractFromZip(String zipFilePath) {
        try {
            Map<String,ServiceCategory> nameMap = new HashMap<>();
            ZipFile zipFile = new ZipFile(zipFilePath);
            Enumeration<? extends ZipEntry> entries = zipFile.entries();
            while (entries.hasMoreElements()) {
                ZipEntry entry = entries.nextElement();
                if (entry.isDirectory()) continue;
                if (!entry.getName().endsWith(".svg")) continue;

                String[] parts = entry.getName().split("/");
                String category = parts[parts.length-2];
                String name = parts[parts.length-1];
                name = name.substring(19);
                ServiceCategory serviceCategory = nameMap.get(category);
                if (serviceCategory == null) {
                    serviceCategory = new ServiceCategory();
                    serviceCategory.setName(category);
                    nameMap.put(category, serviceCategory);
                }

                // Check if entry is a directory
                if (!entry.isDirectory()) {
                    Service service = new Service();
                    serviceCategory.getServices().add(service);
                    service.setName(name);
                    service.setCategory(category);
                    service.setDescription("");
                    try (InputStream inputStream = zipFile.getInputStream(entry)) {
                        // Read and process the entry contents using the inputStream
                    }
                }
            }

            List<ServiceCategory> serviceCategories = new ArrayList<ServiceCategory>(nameMap.values());
            serviceCategories.sort(new Comparator<ServiceCategory>() {
                @Override
                public int compare(ServiceCategory o1, ServiceCategory o2) {
                    return o1.getName().compareTo(o2.getName());
                }
            });
            return serviceCategories;
        }
        catch(Exception e) {
            logger.error("Unable to extract.",e);
            return null;
        }
    }

    public List<ServiceCategory> extractFromFolder(String folderPath) {
        try {
            Map<String,ServiceCategory> nameMap = new HashMap<>();
            File folder = new File(folderPath+"/Azure_Public_Service_Icons/Icons");
            File[] categories = folder.listFiles();
            for (int i = 0; i < categories.length; i++) {
                String category = categories[i].getName();
                File[] services = categories[i].listFiles();
                for (int n = 0; n < services.length; n++) {
                    if (!services[n].getName().endsWith(".svg")) continue;
                    String name = services[n].getName();
                    name = name.substring(19,name.length()-4);
                    name = name.replace("-"," ");
                    ServiceCategory serviceCategory = nameMap.get(category);
                    if (serviceCategory == null) {
                        serviceCategory = new ServiceCategory();
                        serviceCategory.setName(category);
                        nameMap.put(category, serviceCategory);
                    }

                    // Check if entry is a directory
                    Icon icon = new Icon();
                    serviceCategory.getIcons().add(icon);
                    icon.setName(name);
                    icon.setIconPath(services[n].getAbsolutePath());
                }
            }

            List<ServiceCategory> serviceCategories = new ArrayList<ServiceCategory>(nameMap.values());
            serviceCategories.sort(new Comparator<ServiceCategory>() {
                @Override
                public int compare(ServiceCategory o1, ServiceCategory o2) {
                    return o1.getName().compareTo(o2.getName());
                }
            });
            return serviceCategories;
        }
        catch(Exception e) {
            logger.error("Unable to extract.",e);
            return null;
        }
    }

    private static final String folder = "D:\\Work and Career\\Capability\\Infrastructure Architect\\Azure";
    private static final String servicesFilename = folder+"/azure-services.xlsx";
    private static final String nameMapFilename = folder+"/azure.xlsx";

    public static List<ServiceCategory> getServiceCategories() {
        return ServicesExcel.getServiceCategories(servicesFilename,nameMapFilename);
    }

    public static List<ServiceCategory> createPowerpoint() {
        List<ServiceCategory> serviceCategories = getServiceCategories();
        Map<String,ServiceCategory> iconSetMap = new HashMap<String,ServiceCategory>();
        for (ServiceCategory serviceCategory : serviceCategories) {
            if (serviceCategory.getIconSet() != null && serviceCategory.getIconSet().length() > 0) {
                iconSetMap.put(serviceCategory.getIconSet(),serviceCategory);
            }
        }
        List<ServiceCategory> iconServiceCategories = new AzureIcons().extractFromFolder(folder+"/Azure_Public_Service_Icons_V18");
        for (ServiceCategory iconServiceCategory : iconServiceCategories) {
            ServiceCategory serviceCategory = iconSetMap.get(iconServiceCategory.getName());
            for (Icon icon : iconServiceCategory.getIcons()) {
                serviceCategory.getIcons().add(icon);
            }
        }

        String excelFilename = folder+"/azure-icons.xlsx";
        ServicesExcel.save(excelFilename,iconServiceCategories);

        String pptxFilename = folder+"/azure-icons.pptx";
        String pptxTemplateFilename = folder+"/template.pptx";
        createPowerpoint(pptxFilename,pptxTemplateFilename,serviceCategories);
        return iconServiceCategories;
    }

    public static void main(String[] args) {
        List<ServiceCategory> serviceCategories = createPowerpoint();
        for (ServiceCategory serviceCategory : serviceCategories) {
            System.out.println(String.format("%s (%d)",serviceCategory.getName(),serviceCategory.getServices().size()));
        }
    }

}
