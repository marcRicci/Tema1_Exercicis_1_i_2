package servlets;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.RandomAccessFile;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author windeveloper
 */
public class GetDatos extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet GetDatos</title>");            
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet GetDatos at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
         try {
            //For this example j.json is written in one line
            //Get absolute path from root web path /WebContent/*
            ServletContext context = getServletContext();		
            String fullPath = context.getRealPath("/conf.json");

            //Create File object
            File f = new File(fullPath);

            //Create RandomAccessFile Object to read
            RandomAccessFile frar = new RandomAccessFile(f,"r");			
            String jsonString = frar.readLine(); 
            /* use readUTF() only with writeUTF(); */
            frar.close();

            response.setContentType("application/json");
            PrintWriter pw = response.getWriter();
            pw.println(jsonString);

        //} catch(FileNotFoundException e){
        } catch(Exception e){

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            PrintWriter pw = response.getWriter();
            pw.println("{\"error\":\"Ha sido imposible recuperar los datos\"}");
           
        }
      
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        try {
            
        ServletContext context = getServletContext();
        String fullPath = context.getRealPath("/conf.json");
        String dif = request.getParameter("dificultad");
        int dificultad=Integer.parseInt(dif);
        
        File f = new File(fullPath);
        FileWriter fw = new FileWriter(f,false);
        fw.write("{\"dificultad\":"+dificultad+"}");
        fw.close();
        PrintWriter pw = response.getWriter();
        pw.println("{\"mess\":\"El fichero ha sido guardado correctamente\"}");
    } catch(Exception e){
        e.printStackTrace();
    }
        
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
