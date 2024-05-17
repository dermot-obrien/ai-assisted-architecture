package org.dobrien.ea.infrastructure.azure;

import org.dobrien.ea.infrastructure.Service;
import org.dobrien.ea.infrastructure.ServiceCategory;
import org.dobrien.ea.infrastructure.ServicesExcel;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class AzureProductCatalogueRetriever {

    private static Logger logger = LoggerFactory.getLogger(AzureProductCatalogueRetriever.class);

    private String clean(String text) {
        text = text.replaceAll("[^\\x00-\\x7F]", "");
        text = text.trim();
        return text;
    }

    public List<ServiceCategory> save(String filename) {
        try {
            List<ServiceCategory> serviceCategories = retrieve();
            ServicesExcel.save(filename,serviceCategories);
            return serviceCategories;
        }
        catch(Exception e) {
            logger.error("Unable to save.",e);
            return null;
        }
    }

    public List<ServiceCategory> serviceCategories(Document document) {
        try {
            List<ServiceCategory> serviceCategories = new ArrayList<ServiceCategory>();
            Element element = document.selectXpath("//*[@id=\"layout-container-uidb48d\"]/div/div/div[2]").first();
            ServiceCategory serviceCategory = null;
            for (int i = 0; i < element.childrenSize(); i++) {
                if (i % 3 == 1) continue;
                Element child = element.child(i);
                if (i % 3 == 0) {
                    Element h2 = child.selectFirst("h2");
                    String name = h2.text().trim();
                    serviceCategory = new ServiceCategory();
                    serviceCategory.setName(name);
                    serviceCategories.add(serviceCategory);
                    Element p = child.selectFirst("p");
                    String description = p.text().trim();
                    serviceCategory.setDescription(description);
                    Element a = child.selectFirst("a");
                    serviceCategory.setLink(a.attr("href"));
                }
                if (i % 3 == 2) {
                    List<Service> services = services(child);
                    for (Service service : services) {
                        service.setCategory(serviceCategory.getName());
                    }
                    serviceCategory.setServices(services);
                }
            }
            return serviceCategories;
        }
        catch(Exception e) {
            logger.error("Unable to retrieve.",e);
            return null;
        }
    }

    private List<Service> services(Element element) {
        try {
            Elements serviceElements = element.select("div.card-body.pt-3");
            List<Service> services = new ArrayList<>();
            for (Element serviceElement : serviceElements) {
                Service service = new Service();

                // Extracting the data of interest from the service HTML element
                // and storing it in service.
                try {
                    if (serviceElement.selectFirst("h3") == null) continue;
                    if (serviceElement.selectFirst("h3").selectFirst("a") == null) continue;
                    Element a = serviceElement.selectFirst("h3").selectFirst("a");
                    service.setLink(a.attr("href"));
                    String nameText = a.text();
                    String name = clean(nameText);
                    if (!name.equals(nameText)) {
                        service.setInPreview(true);
                    }
                    service.setName(name);
                    if (serviceElement.selectFirst("div") == null) continue;
                    if (serviceElement.selectFirst("div").selectFirst("p") == null) continue;
                    service.setDescription(serviceElement.selectFirst("div").selectFirst("p").text());

                    // adding service to the list of the scraped services
                    services.add(service);
                }
                catch(Exception e) {
                    continue;
                }
            }
            return services;
        }
        catch(Exception e) {
            logger.error("Unable to retrieve.",e);
            return null;
        }
    }

    public List<ServiceCategory> retrieve() {
        try {
            String url = "https://azure.microsoft.com/en-us/products/";
            Document document = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")
                    .header("Accept-Language", "*")
                    .get();

            List<ServiceCategory> serviceCategories = serviceCategories(document);
            return serviceCategories;
        }
        catch(Exception e) {
            logger.error("Unable to retrieve.",e);
            return null;
        }
    }

    public static void main(String[] args) {
        File folder = new File("D:\\Work and Career\\Capability\\Infrastructure Architect\\Azure\\");
        folder.mkdirs();
        String filename = folder+"/azure-services.xlsx";
        List<ServiceCategory> serviceCategories = new AzureProductCatalogueRetriever().save(filename);
        for (ServiceCategory serviceCategory : serviceCategories) {
            System.out.println(String.format("%s (%d)",serviceCategory.getName(),serviceCategory.getServices().size()));
        }
        System.out.println(String.format("Saved to %s",folder.getAbsolutePath()));
    }

}
